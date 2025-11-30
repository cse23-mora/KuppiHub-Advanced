import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/users?id=xxx or ?firebaseUid=xxx - Get user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const firebaseUid = searchParams.get('firebaseUid');

    if (!id && !firebaseUid) {
      return NextResponse.json(
        { error: 'User ID or Firebase UID is required' },
        { status: 400 }
      );
    }

    let query = supabase.from('users').select('*');

    if (id) {
      query = query.eq('id', id);
    } else if (firebaseUid) {
      query = query.eq('firebase_uid', firebaseUid);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'User not found', user: null },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, email, displayName, avatarUrl, role } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Firebase UID and email are required' },
        { status: 400 }
      );
    }

    // Use upsert to create or update
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          firebase_uid: firebaseUid,
          email,
          display_name: displayName || email.split('@')[0],
          avatar_url: avatarUrl,
          role: role || 'student',
        },
        {
          onConflict: 'firebase_uid',
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, firebaseUid, ...updates } = body;

    if (!id && !firebaseUid) {
      return NextResponse.json(
        { error: 'User ID or Firebase UID is required' },
        { status: 400 }
      );
    }

    // Map camelCase to snake_case for database
    const dbUpdates: Record<string, unknown> = {};
    if (updates.displayName) dbUpdates.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.role) dbUpdates.role = updates.role;

    let query = supabase.from('users').update(dbUpdates);

    if (id) {
      query = query.eq('id', id);
    } else if (firebaseUid) {
      query = query.eq('firebase_uid', firebaseUid);
    }

    const { data, error } = await query.select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
