import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Resend } from 'resend';

// Create Resend client with fallback for build time
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - email features will not work');
    return null;
  }
  return new Resend(apiKey);
};

const resend = getResendClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userEmail,
      projectType,
      currentHosting,
      techStack,
      timeline,
      specificChallenges,
      preferredTimes,
      timezone,
      additionalInfo
    } = body;

    // Validate required fields
    if (!userId || !userEmail || !projectType || !timeline || !specificChallenges || !preferredTimes || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Store the intake form data in the database
    const { data: intakeData, error: intakeError } = await supabase
      .from('coaching_intakes')
      .insert({
        user_id: userId,
        user_email: userEmail,
        project_type: projectType,
        current_hosting: currentHosting,
        tech_stack: techStack,
        timeline,
        specific_challenges: specificChallenges,
        preferred_times: preferredTimes,
        timezone,
        additional_info: additionalInfo,
        status: 'submitted',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (intakeError) {
      console.error('Error storing intake data:', intakeError);
      return NextResponse.json(
        { error: 'Failed to store intake data' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      if (resend) {
        await resend.emails.send({
        from: 'Ventaro AI <noreply@ventaroai.com>',
        to: [userEmail],
        subject: 'Coaching Session Intake Form Received - Next Steps',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Coaching Session Confirmed!</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi there,</p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for submitting your coaching session intake form! We've received your information and our team is already preparing for your personalized 1-on-1 session.
              </p>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📋 Your Submission Summary:</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Project Type:</strong> ${projectType}</li>
                  <li><strong>Timeline:</strong> ${timeline}</li>
                  <li><strong>Preferred Times:</strong> ${preferredTimes}</li>
                  <li><strong>Timezone:</strong> ${timezone}</li>
                </ul>
              </div>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #16a34a; margin-top: 0;">📧 What Happens Next:</h3>
                <ol style="color: #374151; line-height: 1.8;">
                  <li><strong>Within 24 hours:</strong> Chris will email you from chris.t@ventarosales.com with available time slots</li>
                  <li><strong>Session Scheduling:</strong> You'll receive a calendar link to book your preferred time</li>
                  <li><strong>Pre-Session Materials:</strong> 3 days before your session, you'll get preparation materials and the meeting link</li>
                  <li><strong>Your Session:</strong> 60-minute personalized coaching with screen sharing and recording</li>
                  <li><strong>Follow-up:</strong> Implementation report and 30-day email support</li>
                </ol>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">📞 Contact Information:</h3>
                <p style="color: #374151; margin: 0;">
                  If you have any questions or need to make changes, please contact:<br>
                  <strong>chris.t@ventarosales.com</strong>
                </p>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                We're excited to help you successfully deploy your website and achieve your goals!
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                The Ventaro AI Team
              </p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 14px;">Ventaro AI Digital Store</p>
              </div>
            </div>
          </div>
        `
        });
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      if (resend) {
        await resend.emails.send({
        from: 'Ventaro AI <noreply@ventaroai.com>',
        to: ['chris.t@ventarosales.com'],
        subject: `New Coaching Intake Form - ${projectType} (${timeline})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">New Coaching Session Intake</h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Information:</h3>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>User ID:</strong> ${userId}</p>
            </div>
            
            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Project Details:</h3>
              <p><strong>Project Type:</strong> ${projectType}</p>
              <p><strong>Current Hosting:</strong> ${currentHosting || 'Not specified'}</p>
              <p><strong>Tech Stack:</strong> ${techStack || 'Not specified'}</p>
              <p><strong>Timeline:</strong> ${timeline}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Scheduling Information:</h3>
              <p><strong>Preferred Times:</strong> ${preferredTimes}</p>
              <p><strong>Timezone:</strong> ${timezone}</p>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Specific Challenges:</h3>
              <p>${specificChallenges}</p>
            </div>
            
            ${additionalInfo ? `
            <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Additional Information:</h3>
              <p>${additionalInfo}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666;">Please respond to the customer within 24 hours with scheduling options.</p>
            </div>
          </div>
        `
        });
      }
    } catch (adminEmailError) {
      console.error('Error sending admin notification:', adminEmailError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Intake form submitted successfully',
        intakeId: intakeData.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing coaching intake:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}