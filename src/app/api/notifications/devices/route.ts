import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { authenticateRequest } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fcm_token, user_id, device_type = "android", app_version } = body;

    // Validate FCM token
    if (!fcm_token || typeof fcm_token !== "string" || fcm_token.trim() === "") {
      return NextResponse.json(
        { error: "Valid fcm_token is required" },
        { status: 400 }
      );
    }

    const trimmedToken = fcm_token.trim();

    // If user_id is provided, verify authentication & ownership
    let verifiedUserId: number | null = null;
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

      if (typeof user_id !== "number") {
        return NextResponse.json(
          { error: "user_id must be a number" },
          { status: 400 }
        );
      }

      // Get verified user's ID from database
      const { data: verifiedUserData } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", verifiedUser.uid)
        .single();

      if (!verifiedUserData) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Only allow users to link their own device
      if (verifiedUserData.id !== user_id) {
        return NextResponse.json(
          { error: "Cannot link device to another user" },
          { status: 403 }
        );
      }

      verifiedUserId = user_id;
    }

    // Validate device_type
    const validDeviceTypes = ["android", "ios", "web"];
    const validatedDeviceType = validDeviceTypes.includes(device_type)
      ? device_type
      : "android";

    // Check if device already exists
    const { data: existingDevice } = await supabase
      .from("user_devices")
      .select("id")
      .eq("fcm_token", trimmedToken)
      .single();

    let result;
    if (existingDevice) {
      // UPDATE existing device
      const { data, error } = await supabase
        .from("user_devices")
        .update({
          user_id: verifiedUserId,
          device_type: validatedDeviceType,
          app_version: app_version || null,
          last_active: new Date().toISOString(),
        })
        .eq("fcm_token", trimmedToken)
        .select()
        .single();

      if (error) {
        console.error("Error updating device:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = {
        success: true,
        message: "Device registered successfully",
        action: "updated",
        data,
      };
    } else {
      // INSERT new device
      const { data, error } = await supabase
        .from("user_devices")
        .insert({
          user_id: verifiedUserId,
          fcm_token: trimmedToken,
          device_type: validatedDeviceType,
          app_version: app_version || null,
          last_active: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting device:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = {
        success: true,
        message: "Device registered successfully",
        action: "created",
        data,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in register device API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
