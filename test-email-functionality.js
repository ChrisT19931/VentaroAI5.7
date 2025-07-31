const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Test contact form email functionality
async function testContactForm() {
  console.log('🧪 Testing Contact Form Email Functionality...');
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message to verify email functionality.',
    product: 'ebook'
  };

  const curlCommand = `curl -s -X POST http://localhost:3003/api/contact \
    -H "Content-Type: application/json" \
    -d '${JSON.stringify(testData)}'`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    
    if (stderr) {
      console.log('❌ Contact form test ERROR:', stderr);
      return;
    }

    const result = JSON.parse(stdout);
    
    if (result.success) {
      console.log('✅ Contact form test PASSED');
      console.log('   - Admin notification email should be sent to chris.t@ventarosales.com');
      console.log('   - Thank you email should be sent to test@example.com');
    } else {
      console.log('❌ Contact form test FAILED:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Contact form test ERROR:', error.message);
  }
}

// Test consultation form email functionality
async function testConsultationForm() {
  console.log('\n🧪 Testing Consultation Form Email Functionality...');
  
  const testData = {
    fullName: 'Test Consultant',
    email: 'consultant@example.com',
    phone: '+1234567890',
    company: 'Test Company',
    projectType: 'E-commerce Website',
    budget: '$5,000 - $10,000',
    timeline: '1-2 months',
    currentWebsite: 'https://example.com',
    projectVision: 'This is a test consultation request to verify email functionality.'
  };

  const curlCommand = `curl -s -X POST http://localhost:3003/api/consultation \
    -H "Content-Type: application/json" \
    -d '${JSON.stringify(testData)}'`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    
    if (stderr) {
      console.log('❌ Consultation form test ERROR:', stderr);
      return;
    }

    const result = JSON.parse(stdout);
    
    if (result.success) {
      console.log('✅ Consultation form test PASSED');
      console.log('   - Admin notification email should be sent to chris.t@ventarosales.com');
      console.log('   - Thank you email should be sent to consultant@example.com');
    } else {
      console.log('❌ Consultation form test FAILED:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Consultation form test ERROR:', error.message);
  }
}

// Test coaching booking email functionality
async function testCoachingBooking() {
  console.log('\n🧪 Testing Coaching Booking Email Functionality...');
  
  const testData = {
    userId: 'test-user-123',
    userEmail: 'coaching@example.com',
    userName: 'Test Coaching Client',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '14:00',
    timezone: 'America/New_York',
    sessionType: 'AI Business Strategy',
    notes: 'This is a test coaching booking to verify email functionality.'
  };

  const curlCommand = `curl -s -X POST http://localhost:3003/api/coaching-booking \
    -H "Content-Type: application/json" \
    -d '${JSON.stringify(testData)}'`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    
    if (stderr) {
      console.log('❌ Coaching booking test ERROR:', stderr);
      return;
    }

    const result = JSON.parse(stdout);
    
    if (result.success) {
      console.log('✅ Coaching booking test PASSED');
      console.log('   - Admin notification email should be sent to chris.t@ventarosales.com');
      console.log('   - Confirmation email should be sent to coaching@example.com');
    } else {
      console.log('❌ Coaching booking test FAILED:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Coaching booking test ERROR:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Email Functionality Tests\n');
  console.log('📧 All forms should send:');
  console.log('   1. Admin notification to chris.t@ventarosales.com');
  console.log('   2. Auto-reply/confirmation email to the user\n');
  
  await testContactForm();
  await testConsultationForm();
  await testCoachingBooking();
  
  console.log('\n✨ All email functionality tests completed!');
  console.log('\n📝 Note: Check your email provider (SendGrid) logs to confirm emails were actually sent.');
  console.log('\n🔍 Forms tested:');
  console.log('   ✅ Contact Form (get my free quote)');
  console.log('   ✅ Consultation Form (web generation)');
  console.log('   ✅ Coaching Booking Form');
}

runTests().catch(console.error);