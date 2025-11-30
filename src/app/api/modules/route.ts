import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/modules?faculty=xxx&department=xxx&semester=xxx
// or GET /api/modules?search=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const faculty = searchParams.get('faculty');
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');
    const search = searchParams.get('search');

    let query = supabase.from('modules').select('*');

    // If search parameter is provided, search by module code or name
    if (search) {
      query = query.or(`module_code.ilike.%${search}%,module_name.ilike.%${search}%`);
    } else {
      // Filter by faculty, department, semester
      if (faculty) {
        query = query.eq('faculty', faculty);
      }
      if (department) {
        query = query.eq('department', department);
      }
      if (semester) {
        query = query.eq('semester', semester);
      }
    }

    query = query.order('module_code', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ modules: data || [] });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST /api/modules - Create a new module (admin only in future)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleCode, moduleName, faculty, department, semester, credits, description } = body;

    if (!moduleCode || !moduleName || !faculty || !semester) {
      return NextResponse.json(
        { error: 'Module code, name, faculty, and semester are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('modules')
      .insert({
        module_code: moduleCode,
        module_name: moduleName,
        faculty,
        department,
        semester,
        credits,
        description,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Module with this code already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ module: data });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
