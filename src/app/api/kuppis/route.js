import { NextResponse } from "next/server";
import supabase from '../../../lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    // Fetch videos along with owner (student) info
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        urls,
        telegram_links,
        material_urls,
        is_kuppi,
        description,
        language_code,
        created_at,
        owner:students(id, name, image_url, faculty_id, department_id)
      `)
      .eq('module_id', Number(moduleId))
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map owner info for easier use
    const videosWithOwner = data.map(video => ({
      ...video,
      owner_name: video.owner?.name || null,
      owner_image: video.owner?.image_url || null,
      owner_faculty_id: video.owner?.faculty_id || null,
      owner_department_id: video.owner?.department_id || null,
    }));

    return NextResponse.json(videosWithOwner);

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
