import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, recipient, product } = await request.json();

    // Validate required fields
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Get product reference if available
  const productRef = product || 'Not specified';

    // Send email notification to admin
    await sendEmail({
      to: recipient || 'chris.t@ventarosales.com',
      from: 'noreply@ventarosales.com', // Update with your verified sender
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Product Reference:</strong> ${productRef}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Optional: Store contact submission in database
    const supabase = await createClient();
    await supabase.from('contact_submissions').insert({
      name,
      email,
      subject,
      product: productRef,
      message,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}