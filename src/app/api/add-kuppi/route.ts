import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// Helper function to get user ID from firebase_uid
async function getUserIdFromFirebaseUid(firebaseUid: string): Promise<number | null> {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("firebase_uid", firebaseUid)
    .single();
  return data?.id || null;
}

// Helper function to find or create student by index_no
async function findOrCreateStudent(indexNo: string): Promise<number | null> {
  const trimmedIndexNo = indexNo.trim().toUpperCase();
  
  // First, try to find existing student
  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("index_no", trimmedIndexNo)
    .single();

  if (existingStudent) {
    return existingStudent.id;
  }

  // Student doesn't exist, create a new one with "Unknown" name
  const { data: newStudent, error } = await supabase
    .from("students")
    .insert({
      name: "Unknown",
      index_no: trimmedIndexNo,
      // Other fields like faculty_id, department_id, batch_id, semester_id 
      // will be null - can be updated later
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating student:", error);
    return null;
  }

  return newStudent?.id || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      module_id,
      title,
      description,
      language_code,
      index_no,
      is_kuppi,
      youtube_links,
      telegram_links,
      gdrive_cloud_video_urls,
      onedrive_cloud_video_urls,
      material_urls,
      firebase_uid, // NEW: Track who added this kuppi
    } = body;

    // Validation
    if (!firebase_uid) {
      return NextResponse.json({ error: "You must be logged in to add a kuppi" }, { status: 401 });
    }
    if (!module_id) {
      return NextResponse.json({ error: "Module is required" }, { status: 400 });
    }
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }
    if (!language_code) {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }

    // Must have at least one link
    const hasLinks =
      (youtube_links && youtube_links.length > 0) ||
      (telegram_links && telegram_links.length > 0) ||
      (gdrive_cloud_video_urls && gdrive_cloud_video_urls.length > 0) ||
      (onedrive_cloud_video_urls && onedrive_cloud_video_urls.length > 0) ||
      (material_urls && material_urls.length > 0);

    if (!hasLinks) {
      return NextResponse.json(
        { error: "At least one video or material link is required" },
        { status: 400 }
      );
    }

    // Get user ID from firebase_uid
    const added_by_user_id = await getUserIdFromFirebaseUid(firebase_uid);
    if (!added_by_user_id) {
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 401 }
      );
    }

    // Find or create student by index_no if provided
    let student_id = null;
    if (index_no && index_no.trim()) {
      student_id = await findOrCreateStudent(index_no);
    }

    // Insert video with added_by_user_id
    const { data, error } = await supabase
      .from("videos")
      .insert({
        module_id,
        title: title.trim(),
        description: description.trim(),
        language_code,
        is_kuppi: is_kuppi ?? true,
        student_id,
        added_by_user_id, // NEW: Track who added this kuppi
        youtube_links: youtube_links && youtube_links.length > 0 ? youtube_links : [],
        telegram_links: telegram_links && telegram_links.length > 0 ? telegram_links : null,
        gdrive_cloud_video_urls:
          gdrive_cloud_video_urls && gdrive_cloud_video_urls.length > 0
            ? gdrive_cloud_video_urls
            : null,
        onedrive_cloud_video_urls:
          onedrive_cloud_video_urls && onedrive_cloud_video_urls.length > 0
            ? onedrive_cloud_video_urls
            : null,
        material_urls: material_urls && material_urls.length > 0 ? material_urls : null,
        published_at: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting video:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Kuppi submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Error in add-kuppi API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
