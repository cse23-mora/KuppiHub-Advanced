import supabase from '../../../lib/supabase';

export async function GET(request: Request) {
  try {
    // Extract department id from query
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const departmentId = idParam ? parseInt(idParam) : null;

    if (!departmentId) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid department id' }),
        { status: 400 }
      );
    }

    // Step 1: Fetch department_semesters
    const { data: ds, error: dsError } = await supabase
      .from('department_semesters')
      .select('semester_id')
      .eq('department_id', departmentId);

    if (dsError) return new Response(JSON.stringify({ error: dsError.message }), { status: 500 });

    if (!ds || ds.length === 0) {
      // No semesters found
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const semesterIds = ds.map(d => d.semester_id);

    // Step 2: Fetch semesters
    const { data: semesters, error: semError } = await supabase
      .from('semesters')
      .select('id,name')
      .in('id', semesterIds);

    if (semError) return new Response(JSON.stringify({ error: semError.message }), { status: 500 });

    return new Response(JSON.stringify(semesters), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
