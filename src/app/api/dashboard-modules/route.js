import { NextResponse } from "next/server";
import supabase from "../../../lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ error: "ids parameter is required" }, { status: 400 });
    }

    // Parse comma-separated module IDs
    const moduleIds = idsParam
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (moduleIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch modules with video counts
    const { data, error } = await supabase
      .from("module_assignments_with_counts")
      .select("*")
      .in("module_id", moduleIds);

    if (error) {
      console.error("Error fetching dashboard modules:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to match expected format
    const transformedData = data.map((item) => ({
      module_id: item.module_id,
      module: {
        id: item.module_id,
        code: item.module_code,
        name: item.module_name,
        description: item.module_description,
      },
      video_count: item.video_count,
    }));

    return NextResponse.json(transformedData);
  } catch (err) {
    console.error("Dashboard modules API error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
