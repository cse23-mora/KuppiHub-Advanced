import supabase from '../../../lib/supabase';

export async function GET(request) {
  const url = new URL(request.url);
  const faculty_id = url.searchParams.get('faculty_id');
  const department_id = url.searchParams.get('department_id');
  const semester_id = url.searchParams.get('semester_id');

  const { data, error } = await supabase
    .from('module_assignments_with_counts')
    .select('*')
    .eq('faculty_id', faculty_id)
    .eq('department_id', department_id)
    .eq('semester_id', semester_id);

  if (error) {
    console.error('Error fetching modules:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const transformedData = data.map(item => ({
    module_id: item.module_id,
    module: {
      id: item.module_id,
      code: item.module_code,
      name: item.module_name,
      description: item.module_description,
    },
    video_count: item.video_count,
  }));

  return new Response(JSON.stringify(transformedData), { status: 200 });
}