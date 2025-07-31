require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY not configured');
  process.exit(1);
}

if (!process.env.EMAIL_FROM) {
  console.error('❌ EMAIL_FROM not configured');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testCoachingBookingEmails() {
  console.log('🧪 Testing Coaching Booking Email System...');
  console.log('📧 SendGrid API Key: ✅ Configured');
  console.log('📧 Email From: ✅', process.env.EMAIL_FROM);
  
  // Test data
  const testBooking = {
    id: 'TEST-' + Date.now(),
    userId: 'test-user-' + Date.now(),
    userEmail: 'chris.t@ventarosales.com', // Using admin email for testing
    userName: 'Test User',
    selectedDate: '2025-01-20',
    selectedTime: '10:00 AM',
    timezone: 'America/New_York',
    sessionType: 'AI Business Strategy Session',
    notes: 'Looking to implement AI automation in my e-commerce business',
    meetingLink: 'https://meet.google.com/test-meeting-link',
    adminNotes: 'Looking forward to our session! Please prepare any specific questions about AI implementation.'
  };
  
  console.log('\n📋 Test Booking Data:');
  console.log('   Booking ID:', testBooking.id);
  console.log('   User:', testBooking.userName);
  console.log('   Email:', testBooking.userEmail);
  console.log('   Date:', testBooking.selectedDate);
  console.log('   Time:', testBooking.selectedTime);
  console.log('   Session:', testBooking.sessionType);
  
  try {
    // Test 1: Customer pending confirmation email
    console.log('\n🔄 Test 1: Customer Pending Confirmation Email...');
    
    const pendingEmail = {
      to: testBooking.userEmail,
      from: process.env.EMAIL_FROM,
      subject: 'Coaching Session Booking Confirmation - Pending Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; margin-bottom: 20px;">🎯 Coaching Session Booking Confirmation</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${testBooking.userName},</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for booking your coaching session! We've received your request and it's currently <strong>pending confirmation</strong>.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📋 Booking Details:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li><strong>Booking ID:</strong> #${testBooking.id}</li>
                <li><strong>Date:</strong> ${testBooking.selectedDate}</li>
                <li><strong>Time:</strong> ${testBooking.selectedTime} (${testBooking.timezone})</li>
                <li><strong>Duration:</strong> 60 minutes</li>
                <li><strong>Session Type:</strong> ${testBooking.sessionType}</li>
                <li><strong>Status:</strong> Pending Confirmation</li>
              </ul>
            </div>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">📧 What happens next?</h3>
              <ul style="color: #1e40af; line-height: 1.8;">
                <li><strong>Confirmation:</strong> We'll confirm your booking within 24 hours</li>
                <li><strong>Meeting Link:</strong> You'll receive a Google Meet link via email</li>
                <li><strong>Calendar Invite:</strong> A calendar invitation will be sent to your email</li>
                <li><strong>Preparation:</strong> We'll send you a brief preparation guide</li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              If you have any questions or need to reschedule, please reply to this email or contact us at chris.t@ventarosales.com
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Kind Regards,<br>
              Ventaro AI
            </p>
          </div>
        </div>
      `
    };
    
    const pendingResult = await sgMail.send(pendingEmail);
    console.log('✅ Customer pending email sent! Status:', pendingResult[0].statusCode);
    
    // Test 2: Admin notification email
    console.log('\n🔄 Test 2: Admin Notification Email...');
    
    const adminEmail = {
      to: 'chris.t@ventarosales.com',
      from: process.env.EMAIL_FROM,
      subject: `🚨 New Coaching Booking Request - ${testBooking.userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">🚨 New Coaching Session Booking</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">A new coaching session has been booked and requires your confirmation.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">👤 Customer Details:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li><strong>Name:</strong> ${testBooking.userName}</li>
                <li><strong>Email:</strong> ${testBooking.userEmail}</li>
                <li><strong>User ID:</strong> ${testBooking.userId}</li>
                <li><strong>Booking ID:</strong> #${testBooking.id}</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📅 Session Details:</h3>
              <ul style="color: #92400e; line-height: 1.8;">
                <li><strong>Date:</strong> ${testBooking.selectedDate}</li>
                <li><strong>Time:</strong> ${testBooking.selectedTime} (${testBooking.timezone})</li>
                <li><strong>Session Type:</strong> ${testBooking.sessionType}</li>
                <li><strong>Notes:</strong> ${testBooking.notes}</li>
              </ul>
            </div>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #1e40af; margin: 0;">⏰ <strong>Action Required:</strong> Please confirm or reschedule this booking within 24 hours.</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Log into the admin panel to manage this booking.
            </p>
          </div>
        </div>
      `
    };
    
    const adminResult = await sgMail.send(adminEmail);
    console.log('✅ Admin notification email sent! Status:', adminResult[0].statusCode);
    
    // Test 3: Customer confirmation email with meeting link
    console.log('\n🔄 Test 3: Customer Confirmation Email with Meeting Link...');
    
    const confirmationEmail = {
      to: testBooking.userEmail,
      from: process.env.EMAIL_FROM,
      subject: '✅ Coaching Session Confirmed - Meeting Details Inside',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #059669; margin-bottom: 20px;">✅ Your Coaching Session is Confirmed!</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${testBooking.userName},</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Great news! Your coaching session has been <strong>confirmed</strong>. I'm excited to work with you!
            </p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="color: #065f46; margin-top: 0;">📅 Session Details:</h3>
              <ul style="color: #065f46; line-height: 1.8;">
                <li><strong>Date:</strong> ${testBooking.selectedDate}</li>
                <li><strong>Time:</strong> ${testBooking.selectedTime} (${testBooking.timezone})</li>
                <li><strong>Duration:</strong> 60 minutes</li>
                <li><strong>Session Type:</strong> ${testBooking.sessionType}</li>
              </ul>
            </div>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">🔗 Meeting Information:</h3>
              <p style="color: #1e40af; margin: 10px 0;"><strong>Google Meet Link:</strong></p>
              <a href="${testBooking.meetingLink}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${testBooking.meetingLink}</a>
              <p style="color: #1e40af; margin: 10px 0; font-size: 14px;">💡 <em>Tip: Test your audio/video 5 minutes before the session</em></p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📝 Pre-Session Notes:</h3>
              <p style="color: #92400e; margin: 0;">${testBooking.adminNotes}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              If you need to reschedule or have any questions, please reply to this email at least 24 hours before the session.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Looking forward to our session!<br>
              <strong>Chris T</strong><br>
              AI Business Strategy Coach
            </p>
          </div>
        </div>
      `
    };
    
    const confirmResult = await sgMail.send(confirmationEmail);
    console.log('✅ Customer confirmation email sent! Status:', confirmResult[0].statusCode);
    
    // Test 4: Cancellation email
    console.log('\n🔄 Test 4: Booking Cancellation Email...');
    
    const cancellationEmail = {
      to: testBooking.userEmail,
      from: process.env.EMAIL_FROM,
      subject: '❌ Coaching Session Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">❌ Coaching Session Cancelled</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${testBooking.userName},</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Unfortunately, your coaching session scheduled for <strong>${testBooking.selectedDate} at ${testBooking.selectedTime}</strong> has been cancelled.
            </p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #991b1b; margin-top: 0;">📋 Cancelled Session Details:</h3>
              <ul style="color: #991b1b; line-height: 1.8;">
                <li><strong>Booking ID:</strong> #${testBooking.id}</li>
                <li><strong>Date:</strong> ${testBooking.selectedDate}</li>
                <li><strong>Time:</strong> ${testBooking.selectedTime} (${testBooking.timezone})</li>
                <li><strong>Session Type:</strong> ${testBooking.sessionType}</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📝 Reason:</h3>
              <p style="color: #92400e; margin: 0;">Schedule conflict - alternative times will be offered</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Please reply to this email to reschedule your session. We apologize for any inconvenience.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Kind Regards,<br>
              Ventaro AI
            </p>
          </div>
        </div>
      `
    };
    
    const cancelResult = await sgMail.send(cancellationEmail);
    console.log('✅ Cancellation email sent! Status:', cancelResult[0].statusCode);
    
    // Final summary
    console.log('\n🎉 Coaching Booking Email System Test Results:');
    console.log('   ✅ Customer pending confirmation email');
    console.log('   ✅ Admin notification email');
    console.log('   ✅ Customer confirmation email with meeting link');
    console.log('   ✅ Booking cancellation email');
    console.log('\n🚀 All coaching booking email templates are working perfectly!');
    console.log('\n📝 Note: The coaching_bookings database table needs to be created in Supabase.');
    console.log('   Run the SQL from check-coaching-table.js in your Supabase dashboard.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response?.body) {
      console.error('   SendGrid Error:', error.response.body);
    }
  }
}

testCoachingBookingEmails();