// src/lib/auth-utils.ts
// Client-side utilities for authenticated API requests

import { User } from "firebase/auth";

/**
 * Get the current user's Firebase ID token
 * This token should be sent as a Bearer token in the Authorization header
 */
export async function getIdToken(user: User | null): Promise<string | null> {
  if (!user) {
    return null;
  }

  try {
    // Force refresh to ensure token is valid
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Create headers object with Authorization Bearer token
 */
export async function getAuthHeaders(user: User | null): Promise<HeadersInit> {
  const token = await getIdToken(user);
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Make an authenticated fetch request
 * Automatically includes the Firebase ID token in the Authorization header
 */
export async function authenticatedFetch(
  user: User | null,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!user) {
    throw new Error("User must be logged in");
  }

  const headers = await getAuthHeaders(user);

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * Make an authenticated GET request
 */
export async function authGet(user: User | null, url: string): Promise<Response> {
  return authenticatedFetch(user, url, { method: "GET" });
}

/**
 * Make an authenticated POST request
 */
export async function authPost(
  user: User | null,
  url: string,
  body: unknown
): Promise<Response> {
  return authenticatedFetch(user, url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated PUT request
 */
export async function authPut(
  user: User | null,
  url: string,
  body: unknown
): Promise<Response> {
  return authenticatedFetch(user, url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated PATCH request
 */
export async function authPatch(
  user: User | null,
  url: string,
  body: unknown
): Promise<Response> {
  return authenticatedFetch(user, url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated DELETE request
 */
export async function authDelete(user: User | null, url: string): Promise<Response> {
  return authenticatedFetch(user, url, { method: "DELETE" });
}
