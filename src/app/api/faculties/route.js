import supabase from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('faculties')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}
