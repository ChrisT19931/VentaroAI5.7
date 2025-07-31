const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testCoachingEmailOnly() {
  console.log('🧪 Testing Coaching Booking Email Functionality (Email Only)...');
  
  const testData = {
    userId: 'test-user-123',
    userEmail: 'test@example.com',
    userName: 'Test User',
    selectedDate: '2024-02-15',
    selectedTime: '14:00',
    timezone: 'America/New_York',
    sessionType: 'AI Business Strategy Session',
    notes: 'Test booking for email functionality'
  };

  const curlCommand = `curl -X POST http://localhost:3003/api/test-coaching-email \
    -H "Content-Type: application/json" \
    -d '${JSON.stringify(testData)}' \
    -w "\nHTTP_CODE:%{http_code}" \
    -s`;

  try {
    const { stdout, stderr } = await execPromise(curlCommand);
    
    if (stderr) {
      console.log('❌ Coaching email test FAILED:', stderr);
      return;
    }

    const lines = stdout.trim().split('\n');
    const httpCodeLine = lines[lines.length - 1];
    const responseBody = lines.slice(0, -1).join('\n');
    const httpCode = httpCodeLine.replace('HTTP_CODE:', '');

    if (httpCode === '200') {
      console.log('✅ Coaching email test PASSED');
      console.log('   - Admin notification email should be sent to chris.t@ventarosales.com');
      console.log('   - Confirmation email should be sent to test@example.com');
      if (responseBody) {
        try {
          const result = JSON.parse(responseBody);
          console.log('   - Response:', result.message || 'Success');
        } catch (e) {
          console.log('   - Response:', responseBody);
        }
      }
    } else {
      console.log(`❌ Coaching email test FAILED: HTTP ${httpCode}`);
      if (responseBody) {
        try {
          const result = JSON.parse(responseBody);
          console.log('   - Error:', result.error || 'Unknown error');
        } catch (e) {
          console.log('   - Response:', responseBody);
        }
      }
    }
  } catch (error) {
    console.log('❌ Coaching email test FAILED:', error.message);
  }
}

testCoachingEmailOnly();