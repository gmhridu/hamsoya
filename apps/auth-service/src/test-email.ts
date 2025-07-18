import { sendEmail } from './utils/sendMail';

// Test function to verify email template works
async function testEmailTemplate() {
  try {
    console.log('Testing email template...');
    
    const testData = {
      name: 'John Doe',
      otp: '1234'
    };
    
    // Note: This will only work if SMTP credentials are configured
    const result = await sendEmail(
      'test@example.com',
      'Test - Verify Your Email',
      'user-activation-mail',
      testData
    );
    
    if (result) {
      console.log('✅ Email template test successful!');
    } else {
      console.log('❌ Email template test failed!');
    }
  } catch (error) {
    console.error('❌ Email template test error:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmailTemplate();
}
