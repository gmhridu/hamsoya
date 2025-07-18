// Test script to verify complete authentication flow through API Gateway
const axios = require('axios');

async function testCompleteAuthFlow() {
  console.log('🧪 Testing Complete Authentication Flow...');

  try {
    // Test 1: API Gateway health check
    console.log('\n1️⃣ Testing API Gateway health...');
    const gatewayHealth = await axios.get(
      'http://localhost:5000/gateway-health'
    );
    console.log('✅ API Gateway healthy:', gatewayHealth.data);

    // Test 2: Auth Service health check
    console.log('\n2️⃣ Testing Auth Service health...');
    const authHealth = await axios.get('http://localhost:5001/');
    console.log('✅ Auth Service healthy:', authHealth.data);

    // Test 3: Frontend accessibility
    console.log('\n3️⃣ Testing frontend accessibility...');
    const frontendResponse = await axios.get('http://localhost:3001/signup');
    console.log('✅ Frontend accessible, status:', frontendResponse.status);

    // Test 4: API Gateway proxy to Auth Service
    console.log('\n4️⃣ Testing API Gateway → Auth Service proxy...');
    const testEmail = `test-${Date.now()}@example.com`;
    const proxyResponse = await axios.post(
      'http://localhost:5000/api/user-registration',
      {
        name: 'Test User',
        email: testEmail,
        password: 'TestPassword123',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ API Gateway proxy successful:', proxyResponse.data);

    console.log('\n🎉 All infrastructure tests passed!');
    console.log('\n📋 Architecture Summary:');
    console.log(
      '   Frontend (port 3001) → API Gateway (port 5000) → Auth Service (port 5001)'
    );
    console.log('\n📝 Next steps to test frontend integration:');
    console.log('1. Open browser at http://localhost:3001/signup');
    console.log('2. Fill out the signup form with test data');
    console.log('3. Check browser console for debug messages:');
    console.log('   - 🔵 AuthForm handleSubmit called with...');
    console.log('   - 🎯 SignupFlow handleSignupSubmit called with...');
    console.log('   - 🚀 Signup method called with...');
    console.log('4. Check network tab for API calls to port 5000');
    console.log('5. Verify OTP email is sent successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('- Make sure API Gateway is running on port 5000');
    console.log('- Make sure Auth Service is running on port 5001');
    console.log('- Make sure Frontend is running on port 3001');
  }
}

testCompleteAuthFlow();
