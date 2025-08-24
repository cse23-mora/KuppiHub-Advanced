import supabase from '../../../lib/supabase';

export async function GET(request) {
  const url = new URL(request.url);
  const faculty_id = url.searchParams.get('faculty_id');
  const department_id = url.searchParams.get('department_id');
  const semester_id = url.searchParams.get('semester_id');

  const { data, error } = await supabase
    .from('module_assignments')
    .select(`
      id,
      module:modules(code, name, description),
      faculty:faculties(name),
      department:departments(name),

      semester:semesters(name)
    `)
    .eq('faculty_id', faculty_id)
    .eq('department_id', department_id)
    .eq('semester_id', semester_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
