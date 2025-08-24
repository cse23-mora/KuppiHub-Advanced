import supabase from "../../../lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return new Response(JSON.stringify({ data: [], error: "Query missing" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) throw error;

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err); // log the actual error
    return new Response(
      JSON.stringify({ data: [], error: err.message || "Search failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
