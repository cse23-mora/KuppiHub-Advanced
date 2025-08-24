import supabase from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('module_assignments')
    .select(`
      id, 
      module:modules(code, name), 
      faculty:faculties(name), 
      department:departments(name), 
      batch:batches(name), 
      semester:semesters(name)
    `);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}
