// src/app/api/semesters/route.js
import supabase from '../../../lib/supabase';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const faculty_id = url.searchParams.get('faculty_id');
    const department_id = url.searchParams.get('department_id');

    if (!faculty_id || !department_id) {
      return new Response(
        JSON.stringify({ error: 'Missing faculty_id or department_id' }),
        { status: 400 }
      );
    }

    // Query department_semesters
    const { data, error } = await supabase
      .from('department_semesters')
      .select('semester:semesters(id,name)')
      .eq('department_id', department_id)
      .order('semester_id', { ascending: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const semesters = Array.from(
      new Map(data.map(d => [d.semester.id, d.semester])).values()
    );

    return new Response(JSON.stringify(semesters), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
