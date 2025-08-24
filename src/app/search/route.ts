import { NextResponse } from "next/server";
import supabase from "../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) return NextResponse.json([], { status: 200 });

  const { data, error } = await supabase
    .from("videos")
    .select("id, title, module_id, is_kuppi, urls")
    .textSearch("search_vector", query)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
