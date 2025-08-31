import { NextResponse } from "next/server";
import supabase from '../../../lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

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
        owner:students(
          name,
          department:departments(
            name
          )
        )
      `)
      .eq('module_id', Number(moduleId))
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
