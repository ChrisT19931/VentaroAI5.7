import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Send thank you email to the client
    await sendEmail({
      to: email,
      from: 'noreply@ventarosales.com',
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
        <p>Thank you for your interest in our services.</p>
        <p>Kind Regards,<br>Ventaro AI</p>
      `,
    });

    // Optional: Store contact submission in database

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