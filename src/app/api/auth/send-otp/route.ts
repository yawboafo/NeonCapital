import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY || '2199f76738b044a36e2ad6f26e0c68ee-77415059-7bea-46d4-88d0-e0afcbd1d740';
const INFOBIP_BASE_URL = 'https://api.infobip.com';

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    console.log('Send OTP attempt - Phone:', phone);

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Format phone number to international format if needed
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+233' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+233' + formattedPhone;
    }

    // Find user by phone (check both formats)
    const user = await db.collection('users').findOne({ 
      $or: [{ phone }, { phone: formattedPhone }]
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials - User not found' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials - Wrong password' },
        { status: 401 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in database with formatted phone
    await db.collection('otps').updateOne(
      { phone: formattedPhone },
      {
        $set: {
          otp,
          expiresAt,
          verified: false,
          createdAt: new Date(),
          originalPhone: phone,
        },
      },
      { upsert: true }
    );

    // Send SMS via Infobip with formatted international number
    try {
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
      console.log('Infobip response:', infobipData);

      if (!infobipResponse.ok) {
        console.error('Infobip error:', infobipData);
        return NextResponse.json(
          { success: false, error: 'Failed to send OTP' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      return NextResponse.json(
        { success: false, error: 'Failed to send SMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
