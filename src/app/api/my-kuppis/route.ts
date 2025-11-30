import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// GET - Fetch all kuppis added by the logged-in user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firebase_uid = searchParams.get("firebase_uid");

    if (!firebase_uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from firebase_uid
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", firebase_uid)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all videos added by this user
    const { data, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        description,
        youtube_links,
        telegram_links,
        gdrive_cloud_video_urls,
        onedrive_cloud_video_urls,
        material_urls,
        is_kuppi,
        is_hidden,
        language_code,
        created_at,
        published_at,
        module:module_id (
          id,
          code,
          name
        ),
        student:student_id (
          id,
          name,
          index_no
        )
      `)
      .eq("added_by_user_id", userData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching my kuppis:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error in GET /api/my-kuppis:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update a kuppi (title, description, links, or hide/unhide)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firebase_uid,
      video_id,
      title,
      description,
      language_code,
      is_hidden,
      youtube_links,
      telegram_links,
      gdrive_cloud_video_urls,
      onedrive_cloud_video_urls,
      material_urls,
    } = body;

    if (!firebase_uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!video_id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // Get user ID from firebase_uid
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", firebase_uid)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the user owns this video
    const { data: videoData } = await supabase
      .from("videos")
      .select("id, added_by_user_id")
      .eq("id", video_id)
      .single();

    if (!videoData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (videoData.added_by_user_id !== userData.id) {
      return NextResponse.json({ error: "You can only edit your own kuppis" }, { status: 403 });
    }

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (language_code !== undefined) updateData.language_code = language_code;
    if (is_hidden !== undefined) updateData.is_hidden = is_hidden;
    if (youtube_links !== undefined) updateData.youtube_links = youtube_links;
    if (telegram_links !== undefined) updateData.telegram_links = telegram_links;
    if (gdrive_cloud_video_urls !== undefined) updateData.gdrive_cloud_video_urls = gdrive_cloud_video_urls;
    if (onedrive_cloud_video_urls !== undefined) updateData.onedrive_cloud_video_urls = onedrive_cloud_video_urls;
    if (material_urls !== undefined) updateData.material_urls = material_urls;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Update the video
    const { data, error } = await supabase
      .from("videos")
      .update(updateData)
      .eq("id", video_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating video:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: is_hidden !== undefined 
        ? (is_hidden ? "Kuppi hidden successfully" : "Kuppi unhidden successfully")
        : "Kuppi updated successfully",
      data,
    });
  } catch (err) {
    console.error("Error in PUT /api/my-kuppis:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Toggle hide/unhide a kuppi (quick action)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebase_uid, video_id } = body;

    if (!firebase_uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!video_id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // Get user ID from firebase_uid
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", firebase_uid)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current video state and verify ownership
    const { data: videoData } = await supabase
      .from("videos")
      .select("id, added_by_user_id, is_hidden")
      .eq("id", video_id)
      .single();

    if (!videoData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (videoData.added_by_user_id !== userData.id) {
      return NextResponse.json({ error: "You can only edit your own kuppis" }, { status: 403 });
    }

    // Toggle is_hidden
    const newHiddenState = !videoData.is_hidden;

    const { data, error } = await supabase
      .from("videos")
      .update({ is_hidden: newHiddenState })
      .eq("id", video_id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling video visibility:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: newHiddenState ? "Kuppi hidden successfully" : "Kuppi is now visible",
      data,
    });
  } catch (err) {
    console.error("Error in PATCH /api/my-kuppis:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
