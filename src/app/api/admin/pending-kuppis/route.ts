import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/admin/pending-kuppis - Get kuppis pending approval
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', adminId)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get pending kuppis
    const { data, error } = await supabase
      .from('kuppis')
      .select(`
        *,
        users:tutor_id (
          id,
          display_name,
          email,
          avatar_url
        ),
        modules:module_code (
          module_code,
          module_name
        )
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ pendingKuppis: data || [] });
  } catch (error) {
    console.error('Error fetching pending kuppis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending kuppis' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pending-kuppis - Approve or reject a kuppi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, kuppiId, action } = body;

    if (!adminId || !kuppiId || !action) {
      return NextResponse.json(
        { error: 'Admin ID, kuppi ID, and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', adminId)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    if (action === 'approve') {
      // Approve kuppi
      const { error } = await supabase
        .from('kuppis')
        .update({ is_approved: true })
        .eq('id', kuppiId);

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Kuppi approved successfully' 
      });
    } else {
      // Reject kuppi - delete it
      const { error } = await supabase
        .from('kuppis')
        .delete()
        .eq('id', kuppiId);

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Kuppi rejected and removed' 
      });
    }
  } catch (error) {
    console.error('Error processing kuppi approval:', error);
    return NextResponse.json(
      { error: 'Failed to process kuppi approval' },
      { status: 500 }
    );
  }
}
