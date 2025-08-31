
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Here you can:
    // 1. Save data to database
    // 2. Send email via SendGrid, Nodemailer, etc.
    // For now, we just log it
    console.log('Contact Form Submission:', data);

    return NextResponse.json({ success: true, message: 'Message received' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
