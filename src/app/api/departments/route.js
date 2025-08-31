import supabase from '../../../lib/supabase';

export async function GET(request) {
  // Get the URL object
  const url = new URL(request.url);
  // Get the faculty_id from query string
  const faculty_id = url.searchParams.get('faculty_id');

  const { data, error } = await supabase
    .from('departments')
    .select('id, name, faculty_id')
    .eq('faculty_id', faculty_id)
    .order('id', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
