import { NextResponse } from "next/server";
import supabase from '../../../lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, urls, telegram_links, material_urls, is_kuppi,discription')
      .eq('module_id', Number(moduleId))
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
