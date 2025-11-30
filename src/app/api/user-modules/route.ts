import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/user-modules?userId=xxx - Get user's saved modules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('user_modules')
      .select(`
        *,
        modules:module_code (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ userModules: data || [] });
  } catch (error) {
    console.error('Error fetching user modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user modules' },
      { status: 500 }
    );
  }
}

// POST /api/user-modules - Add modules to user's dashboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleCodes, faculty, department, semester } = body;

    if (!userId || !moduleCodes || !Array.isArray(moduleCodes)) {
      return NextResponse.json(
        { error: 'User ID and module codes array are required' },
        { status: 400 }
      );
    }

    // Create user_modules entries
    const entries = moduleCodes.map((moduleCode: string) => ({
      user_id: userId,
      module_code: moduleCode,
      faculty,
      department,
      semester,
    }));

    // Use upsert to handle duplicates
    const { data, error } = await supabase
      .from('user_modules')
      .upsert(entries, { 
        onConflict: 'user_id,module_code',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      added: data?.length || 0 
    });
  } catch (error) {
    console.error('Error adding user modules:', error);
    return NextResponse.json(
      { error: 'Failed to add user modules' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-modules - Remove a module from user's dashboard
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleCode } = body;

    if (!userId || !moduleCode) {
      return NextResponse.json(
        { error: 'User ID and module code are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('user_modules')
      .delete()
      .eq('user_id', userId)
      .eq('module_code', moduleCode);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing user module:', error);
    return NextResponse.json(
      { error: 'Failed to remove user module' },
      { status: 500 }
    );
  }
}
