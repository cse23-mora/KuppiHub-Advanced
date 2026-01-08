# Notification APIs - Security & Auth Checklist

## Overview
All 5 notification APIs have been secured with proper authentication and authorization checks.

---

## API Security Matrix

| API | Endpoint | Auth Required | Ownership Check | Notes |
|-----|----------|---|---|---|
| ✅ **Register Device** | `POST /api/notifications/devices` | ✅ If user_id provided | ✅ Yes (user can only link own device) | Guest registration is anonymous |
| ✅ **Device Logout** | `POST /api/notifications/logout` | ✅ Yes | ✅ Yes (user can only logout own device) | Must be authenticated to logout |
| ✅ **Get Notifications** | `GET /api/notifications` | ✅ Yes | ✅ Yes (sees only own notifications) | Firebase token required |
| ✅ **Mark as Read** | `PUT /api/notifications/{id}/read` | ✅ Yes | ✅ Yes (can only mark own notifications) | User isolation enforced |
| ✅ **Send Notification** | `POST /api/notifications/send` | ✅ Yes (Admin only) | ✅ N/A (admin action) | Admin secret or admin Firebase token |

---

## 1. Register Device API - `POST /api/notifications/devices`

### ✅ Security Checks

**Guest Registration (No Auth Required):**
```
1. Validate FCM token (required, non-empty)
2. Generate unique device record
✅ User is guest (user_id = NULL)
✅ Can receive: Broadcasts only
```

**Authenticated Registration (Auth Required):**
```
1. Validate FCM token (required, non-empty)
2. Get Authorization header → Firebase token
3. Verify Firebase token ✅ AUTHENTICATION CHECK
4. Get user ID from Firebase UID in database
5. Verify user exists ✅ USER EXISTS CHECK
6. Verify provided user_id matches authenticated user ✅ OWNERSHIP CHECK
7. Only then link device to user (user_id = provided_id)
✅ User is authenticated (user_id = their ID)
✅ Can receive: Personalized + Broadcasts
```

### Code Snippet
```typescript
if (user_id) {
  // ============ AUTHENTICATION CHECK ============
  const authHeader = request.headers.get("authorization");
  const verifiedUser = await authenticateRequest(authHeader);

  if (!verifiedUser) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to link a device." },
      { status: 401 }
    );
  }

  // Get verified user's ID from database
  const { data: verifiedUserData } = await supabase
    .from("users")
    .select("id")
    .eq("firebase_uid", verifiedUser.uid)
    .single();

  if (!verifiedUserData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ OWNERSHIP CHECK - Only allow users to link their own device
  if (verifiedUserData.id !== user_id) {
    return NextResponse.json(
      { error: "Cannot link device to another user" },
      { status: 403 }
    );
  }

  verifiedUserId = user_id;
}
```

---

## 2. Device Logout API - `POST /api/notifications/logout`

### ✅ Security Checks

```
1. Get Authorization header → Firebase token
2. Verify Firebase token ✅ AUTHENTICATION CHECK
3. Get current user ID from Firebase UID
4. Get device from FCM token
5. Verify device belongs to current user ✅ OWNERSHIP CHECK
6. Only then set user_id to NULL (convert to guest)
```

### Code Snippet
```typescript
// ============ AUTHENTICATION CHECK ============
const authHeader = request.headers.get("authorization");
const verifiedUser = await authenticateRequest(authHeader);

if (!verifiedUser) {
  return NextResponse.json(
    { error: "Unauthorized. Please log in." },
    { status: 401 }
  );
}

// Get current user's ID
const { data: userData } = await supabase
  .from("users")
  .select("id")
  .eq("firebase_uid", verifiedUser.uid)
  .single();

// Check if device exists AND belongs to current user
const { data: existingDevice } = await supabase
  .from("user_devices")
  .select("id, user_id")
  .eq("fcm_token", trimmedToken)
  .single();

// ✅ OWNERSHIP CHECK - Only allow users to logout their own devices
if (existingDevice.user_id && existingDevice.user_id !== userData.id) {
  return NextResponse.json(
    { error: "Cannot logout another user's device" },
    { status: 403 }
  );
}
```

---

## 3. Get Notifications History API - `GET /api/notifications`

### ✅ Security Checks

```
1. Get Authorization header → Firebase token
2. Verify Firebase token ✅ AUTHENTICATION CHECK
3. Get user ID from Firebase UID
4. Query notifications WHERE user_id = current_user_id ✅ USER ISOLATION
5. Return only their own notifications
```

### Code Snippet
```typescript
// ============ SERVER-SIDE AUTHENTICATION ============
const authHeader = request.headers.get("authorization");
const verifiedUser = await authenticateRequest(authHeader);

if (!verifiedUser) {
  return NextResponse.json(
    { error: "Unauthorized. Please log in." },
    { status: 401 }
  );
}

// Get user ID from Firebase UID
const { data: userData } = await supabase
  .from("users")
  .select("id")
  .eq("firebase_uid", verifiedUser.uid)
  .single();

const userId = userData.id;

// ============ FETCH NOTIFICATIONS WITH USER ISOLATION ============
const { data: notifications } = await supabase
  .from("notifications")
  .select("*", { count: "exact" })
  .eq("user_id", userId)  // ✅ ONLY THEIR NOTIFICATIONS
  .order("created_at", { ascending: false })
  .range(offset, offset + limit - 1);
```

---

## 4. Mark Notification as Read API - `PUT /api/notifications/{id}/read`

### ✅ Security Checks

```
1. Get Authorization header → Firebase token
2. Verify Firebase token ✅ AUTHENTICATION CHECK
3. Get user ID from Firebase UID
4. Query notification by ID where user_id = current_user_id ✅ OWNERSHIP CHECK
5. If not found, return 404 (not 403 to avoid info leak)
6. Only then update is_read = true
```

### Code Snippet
```typescript
// ============ SERVER-SIDE AUTHENTICATION ============
const authHeader = request.headers.get("authorization");
const verifiedUser = await authenticateRequest(authHeader);

if (!verifiedUser) {
  return NextResponse.json(
    { error: "Unauthorized. Please log in." },
    { status: 401 }
  );
}

const userId = userData.id;

// ============ VERIFY OWNERSHIP & UPDATE ============
const { data: notification } = await supabase
  .from("notifications")
  .select("id")
  .eq("id", notificationId)
  .eq("user_id", userId)  // ✅ OWNERSHIP CHECK
  .single();

if (!notification) {
  return NextResponse.json(
    { error: "Notification not found or access denied" },
    { status: 404 }
  );
}
```

---

## 5. Send Notification API - `POST /api/notifications/send`

### ✅ Security Checks

```
1. Check for Admin Secret OR Firebase Admin Token ✅ ADMIN AUTH CHECK
2. Method 1: x-admin-secret header matches NOTIFICATIONS_ADMIN_SECRET
3. Method 2: Firebase token + user has is_admin = true
4. If neither, return 403 Unauthorized
5. Validate target_type and target_value
6. For "user" type: Query devices by user_id (no access to other users)
7. For "guest_broadcast": Query all guest devices (no user isolation issue)
8. For "topic": Scheduled broadcast (no data leak)
```

### Code Snippet
```typescript
// ============ ADMIN AUTHENTICATION ============
const isAdminUser = await isAdmin(request);
if (!isAdminUser) {
  return NextResponse.json(
    { error: "Unauthorized. Admin access required." },
    { status: 403 }
  );
}

async function isAdmin(request: NextRequest): Promise<boolean> {
  // Method 1: Check admin secret header
  const adminSecret = request.headers.get("x-admin-secret");
  if (adminSecret && ADMIN_SECRET && adminSecret === ADMIN_SECRET) {
    return true;
  }

  // Method 2: Check Firebase auth + admin role
  const authHeader = request.headers.get("authorization");
  const verifiedUser = await authenticateRequest(authHeader);
  if (!verifiedUser) {
    return false;
  }

  const { data: userData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("firebase_uid", verifiedUser.uid)
    .single();

  return userData?.is_admin === true;
}
```

---

## Error Responses & Security

### ✅ Proper Error Messages (No Info Leakage)

| Scenario | Status | Response | Why |
|----------|--------|----------|-----|
| Missing FCM token | 400 | "Valid fcm_token is required" | ✅ Input validation error |
| Invalid Firebase token | 401 | "Unauthorized. Please log in." | ✅ Auth failure, not info leak |
| Device doesn't exist | 404 | "Device not found" | ✅ No info leak |
| Try to logout another user's device | 403 | "Cannot logout another user's device" | ✅ Clear but secure |
| Try to read another user's notification | 404 | "Notification not found or access denied" | ✅ Doesn't expose which exists |
| Not admin sending notification | 403 | "Unauthorized. Admin access required." | ✅ Clear denial |

---

## Attack Prevention

### 1. SQL Injection
- ✅ Using Supabase parameterized queries (no raw SQL)
- ✅ All user inputs validated before use

### 2. Authorization Bypass
- ✅ User isolation enforced in database queries (`.eq("user_id", userId)`)
- ✅ Ownership verification before updates
- ✅ Admin role check for privileged operations

### 3. Token Hijacking
- ✅ Firebase token validated on every request
- ✅ Admin secret stored in environment (not in code)
- ✅ FCM tokens unique per device

### 4. Data Leakage
- ✅ Pagination validated (1-100 items only)
- ✅ Users see only their own notifications
- ✅ Devices only logout if owned by user
- ✅ Response doesn't leak unrelated user data

### 5. Rate Limiting (Future)
- ⚠️ NOT YET IMPLEMENTED
- Recommend adding rate limiting per user/device for:
  - Notification sending (prevent spam)
  - Device registration (prevent tokens table explosion)
  - Mark as read (prevent abuse)

---

## Testing the Security

### Test 1: Register Device - Guest (No Auth)
```bash
curl -X POST http://localhost:3000/api/notifications/devices \
  -H "Content-Type: application/json" \
  -d '{"fcm_token": "test123"}'
# ✅ Should succeed - guest registration
```

### Test 2: Register Device - User (With Auth)
```bash
curl -X POST http://localhost:3000/api/notifications/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VALID_TOKEN" \
  -d '{"fcm_token": "test123", "user_id": 5}'
# ✅ Should succeed if user_id matches authenticated user
```

### Test 3: Register Device - User (Wrong User ID)
```bash
curl -X POST http://localhost:3000/api/notifications/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_FOR_USER_5" \
  -d '{"fcm_token": "test123", "user_id": 10}'
# ❌ Should fail with 403 - Cannot link device to another user
```

### Test 4: Get Notifications (No Auth)
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1"
# ❌ Should fail with 401 - Unauthorized
```

### Test 5: Get Notifications (Valid Auth)
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1" \
  -H "Authorization: Bearer VALID_TOKEN"
# ✅ Should succeed - returns only their notifications
```

### Test 6: Mark as Read (Other User's Notification)
```bash
curl -X PUT http://localhost:3000/api/notifications/999/read \
  -H "Authorization: Bearer TOKEN_FOR_USER_5"
# ❌ Should fail with 404 - if notification belongs to other user
```

### Test 7: Send Notification (No Admin)
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NON_ADMIN_TOKEN" \
  -d '{"target_type": "user", "target_value": "123", "title": "Test", "body": "Test"}'
# ❌ Should fail with 403 - Admin access required
```

### Test 8: Send Notification (With Admin Secret)
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_ADMIN_SECRET" \
  -d '{"target_type": "user", "target_value": "123", "title": "Test", "body": "Test"}'
# ✅ Should succeed
```

### Test 9: Logout (No Auth)
```bash
curl -X POST http://localhost:3000/api/notifications/logout \
  -H "Content-Type: application/json" \
  -d '{"fcm_token": "test123"}'
# ❌ Should fail with 401 - Unauthorized
```

### Test 10: Logout (Different User's Device)
```bash
curl -X POST http://localhost:3000/api/notifications/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_FOR_USER_5" \
  -d '{"fcm_token": "device_of_user_10"}'
# ❌ Should fail with 403 - Cannot logout another user's device
```

---

## Summary

✅ **All 5 APIs are now secure:**
- Register Device: Guest anonymous, user authenticated with ownership check
- Logout Device: Requires authentication + ownership verification
- Get Notifications: Requires auth + user isolation in query
- Mark as Read: Requires auth + ownership verification per notification
- Send Notification: Requires admin secret or admin role

✅ **All endpoints prevent:**
- Unauthorized access
- Cross-user data access
- Device hijacking
- Admin impersonation
