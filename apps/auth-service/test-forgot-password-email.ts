import { sendEmail } from './src/utils/sendMail';

// Test function to verify forgot password email template works
async function testForgotPasswordEmailTemplate() {
  try {
    console.log('Testing forgot password email template...');
    
    const testData = {
      name: 'John Doe',
      otp: '123456'
    };
    
    // Test the forgot password email template
    const result = await sendEmail(
      'test@example.com',
      'Reset Your Password - Hamsoya',
      'forgot-password-user-mail',
      testData
    );
    
    if (result) {
      console.log('✅ Forgot password email template test successful!');
      console.log('📧 Email would be sent with:');
      console.log(`   To: test@example.com`);
      console.log(`   Subject: Reset Your Password - Hamsoya`);
      console.log(`   Template: forgot-password-user-mail`);
      console.log(`   Name: ${testData.name}`);
      console.log(`   OTP: ${testData.otp}`);
    } else {
      console.log('❌ Forgot password email template test failed!');
    }
  } catch (error) {
    console.error('❌ Forgot password email template test error:', error);
    
    // Check if it's a template not found error
    if (error instanceof Error && error.message.includes('ENOENT')) {
      console.error('🔍 Template file not found. Please check:');
      console.error('   - apps/auth-service/src/utils/email-templates/forgot-password-user-mail.ejs');
      console.error('   - apps/auth-service/src/utils/email-templates/forgot-password-user-mail.txt');
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testForgotPasswordEmailTemplate();
}
