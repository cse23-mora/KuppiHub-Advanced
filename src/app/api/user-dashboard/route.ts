import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Fetch user's dashboard modules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_dashboard_modules')
      .select('module_ids')
      .eq('user_email', userEmail)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    return NextResponse.json({ 
      moduleIds: data?.module_ids || [] 
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}

// POST - Save user's dashboard modules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, moduleIds } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Upsert - insert or update if exists
    const { data, error } = await supabase
      .from('user_dashboard_modules')
      .upsert(
        { 
          user_email: email, 
          module_ids: moduleIds || [],
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_email' }
      )
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      data 
    });
  } catch (error) {
    console.error('Error saving user dashboard:', error);
    return NextResponse.json({ error: 'Failed to save dashboard' }, { status: 500 });
  }
}
