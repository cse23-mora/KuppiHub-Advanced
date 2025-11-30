import { NextResponse } from "next/server";
import supabase from '../../../lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    // Fetch videos with added_by_user info to filter by approval status
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        youtube_links,
        telegram_links,
        material_urls,
        onedrive_cloud_video_urls,
        gdrive_cloud_video_urls,
        is_kuppi,
        description,
        language_code,
        created_at,
        added_by_user_id,
        owner:students(
          name,
          department:departments(
            name
          )
        ),
        added_by_user:users!videos_added_by_user_id_fkey(
          is_approved_for_kuppies
        )
      `)
      .eq('module_id', Number(moduleId))
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter videos: show if no user attached (old videos) OR if user is approved
    const filteredData = data.filter(video => {
      // If no user attached (legacy videos), show them
      if (!video.added_by_user_id || !video.added_by_user) {
        return true;
      }
      // If user is approved for kuppies, show their videos
      return video.added_by_user.is_approved_for_kuppies === true;
    });

    // Remove the added_by_user field from response (not needed by frontend)
    const cleanedData = filteredData.map(({ added_by_user, added_by_user_id, ...rest }) => rest);

    return NextResponse.json(cleanedData);

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
