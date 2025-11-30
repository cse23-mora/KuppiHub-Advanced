'use server';

import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/modules/[moduleCode] - Get a specific module with its kuppis
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleCode: string }> }
) {
  try {
    const { moduleCode } = await params;

    // Get module details
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('module_code', moduleCode)
      .single();

    if (moduleError) {
      if (moduleError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        );
      }
      throw moduleError;
    }

    // Get all kuppis for this module
    const { data: kuppis, error: kuppisError } = await supabase
      .from('kuppis')
      .select(`
        *,
        users:tutor_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('module_code', moduleCode)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (kuppisError) {
      throw kuppisError;
    }

    return NextResponse.json({
      module,
      kuppis: kuppis || [],
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}
