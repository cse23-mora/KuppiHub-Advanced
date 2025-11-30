import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/kuppis?moduleCode=xxx - Get kuppis for a module
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleCode = searchParams.get('moduleCode');
    const tutorId = searchParams.get('tutorId');
    const approved = searchParams.get('approved');

    let query = supabase
      .from('kuppis')
      .select(`
        *,
        users:tutor_id (
          id,
          display_name,
          avatar_url
        ),
        modules:module_code (
          module_code,
          module_name
        )
      `)
      .order('created_at', { ascending: false });

    if (moduleCode) {
      query = query.eq('module_code', moduleCode);
    }

    if (tutorId) {
      query = query.eq('tutor_id', tutorId);
    }

    if (approved !== null) {
      query = query.eq('is_approved', approved === 'true');
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ kuppis: data || [] });
  } catch (error) {
    console.error('Error fetching kuppis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kuppis' },
      { status: 500 }
    );
  }
}

// POST /api/kuppis - Create a new kuppi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      moduleCode,
      tutorId,
      youtubeLinks,
      telegramLinks,
      materialUrls,
      thumbnailUrl,
      language,
    } = body;

    if (!title || !moduleCode || !tutorId) {
      return NextResponse.json(
        { error: 'Title, module code, and tutor ID are required' },
        { status: 400 }
      );
    }

    // Validate that at least one content link is provided
    const hasContent =
      (youtubeLinks && youtubeLinks.length > 0) ||
      (telegramLinks && telegramLinks.length > 0) ||
      (materialUrls && materialUrls.length > 0);

    if (!hasContent) {
      return NextResponse.json(
        { error: 'At least one YouTube link, Telegram link, or material URL is required' },
        { status: 400 }
      );
    }

    // Check if tutor is verified
    const { data: tutor, error: tutorError } = await supabase
      .from('users')
      .select('is_verified, role')
      .eq('id', tutorId)
      .single();

    if (tutorError || !tutor) {
      return NextResponse.json(
        { error: 'Invalid tutor' },
        { status: 400 }
      );
    }

    // Auto-approve if tutor is verified
    const isApproved = tutor.is_verified && tutor.role === 'tutor';

    const { data, error } = await supabase
      .from('kuppis')
      .insert({
        title,
        description,
        module_code: moduleCode,
        tutor_id: tutorId,
        youtube_links: youtubeLinks || [],
        telegram_links: telegramLinks || [],
        material_urls: materialUrls || [],
        thumbnail_url: thumbnailUrl,
        language: language || 'sinhala',
        is_approved: isApproved,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      kuppi: data,
      message: isApproved 
        ? 'Kuppi published successfully' 
        : 'Kuppi submitted for approval'
    });
  } catch (error) {
    console.error('Error creating kuppi:', error);
    return NextResponse.json(
      { error: 'Failed to create kuppi' },
      { status: 500 }
    );
  }
}

// PATCH /api/kuppis - Update a kuppi
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tutorId, ...updates } = body;

    if (!id || !tutorId) {
      return NextResponse.json(
        { error: 'Kuppi ID and tutor ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('kuppis')
      .select('tutor_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Kuppi not found' },
        { status: 404 }
      );
    }

    if (existing.tutor_id !== tutorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Map camelCase to snake_case for database
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.youtubeLinks) dbUpdates.youtube_links = updates.youtubeLinks;
    if (updates.telegramLinks) dbUpdates.telegram_links = updates.telegramLinks;
    if (updates.materialUrls) dbUpdates.material_urls = updates.materialUrls;
    if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl;
    if (updates.language) dbUpdates.language = updates.language;

    const { data, error } = await supabase
      .from('kuppis')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ kuppi: data });
  } catch (error) {
    console.error('Error updating kuppi:', error);
    return NextResponse.json(
      { error: 'Failed to update kuppi' },
      { status: 500 }
    );
  }
}

// DELETE /api/kuppis - Delete a kuppi
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tutorId } = body;

    if (!id || !tutorId) {
      return NextResponse.json(
        { error: 'Kuppi ID and tutor ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('kuppis')
      .select('tutor_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Kuppi not found' },
        { status: 404 }
      );
    }

    if (existing.tutor_id !== tutorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('kuppis')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kuppi:', error);
    return NextResponse.json(
      { error: 'Failed to delete kuppi' },
      { status: 500 }
    );
  }
}
