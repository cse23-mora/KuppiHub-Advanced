import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/admin/pending-tutors - Get tutors pending verification
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

    // Get pending tutors
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'tutor')
      .eq('is_verified', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ pendingTutors: data || [] });
  } catch (error) {
    console.error('Error fetching pending tutors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending tutors' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pending-tutors - Verify or reject a tutor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, tutorId, action } = body;

    if (!adminId || !tutorId || !action) {
      return NextResponse.json(
        { error: 'Admin ID, tutor ID, and action are required' },
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
      // Approve tutor
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', tutorId);

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Tutor approved successfully' 
      });
    } else {
      // Reject tutor - set role back to student
      const { error } = await supabase
        .from('users')
        .update({ role: 'student', is_verified: false })
        .eq('id', tutorId);

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Tutor application rejected' 
      });
    }
  } catch (error) {
    console.error('Error processing tutor verification:', error);
    return NextResponse.json(
      { error: 'Failed to process tutor verification' },
      { status: 500 }
    );
  }
}
