const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/neoncapital';
const INFOBIP_API_KEY = '2199f76738b044a36e2ad6f26e0c68ee-77415059-7bea-46d4-88d0-e0afcbd1d740';
const INFOBIP_BASE_URL = 'https://api.infobip.com';

async function testOTP() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('neoncapital');
    
    // Get first user
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log('\n📱 User found:');
    console.log('   Name:', user.name);
    console.log('   Phone:', user.phone);
    console.log('   Email:', user.email);
    
    // Format phone number to international format
    let formattedPhone = user.phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+233' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+233' + formattedPhone;
    }
    console.log('   Formatted Phone:', formattedPhone);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('\n🔐 Generated OTP:', otp);
    
    // Store OTP in database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.collection('otps').updateOne(
      { phone: formattedPhone },
      {
        $set: {
          otp,
          expiresAt,
          verified: false,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log('✅ OTP stored in database');
    
    // Send SMS via Infobip
    console.log('\n📤 Sending SMS via Infobip...');
    
    const infobipResponse = await fetch(`${INFOBIP_BASE_URL}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            destinations: [{ to: formattedPhone }],
            from: 'NeonCapital',
            text: `Your Neon Capital verification code is: ${otp}. This code will expire in 10 minutes.`,
          },
        ],
      }),
    });
    
    const infobipData = await infobipResponse.json();
    
    if (infobipResponse.ok) {
      console.log('✅ SMS sent successfully!');
      console.log('\n📊 Infobip Response:');
      console.log(JSON.stringify(infobipData, null, 2));
    } else {
      console.log('❌ Failed to send SMS');
      console.log('\n📊 Infobip Error:');
      console.log(JSON.stringify(infobipData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testOTP();
