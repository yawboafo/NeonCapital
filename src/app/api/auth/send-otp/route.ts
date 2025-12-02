import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

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

    // Check if phone starts with "9999" for OTP bypass (testing mode)
    const cleanedPhone = phone.replace(/[^0-9+]/g, '');
    const shouldBypassOTP = cleanedPhone.startsWith('9999');
    
    // Strip "9999" prefix for database lookup if present
    let lookupPhone = shouldBypassOTP 
      ? phone.replace(/^9999/, '') 
      : phone;

    // Try to find user by exact phone match first
    let user = await db.collection('users').findOne({ phone: lookupPhone });

    // If not found and bypass mode, try matching by digits only
    if (!user && shouldBypassOTP) {
      // Get just the digits from the lookup phone (after stripping 9999)
      const digitsOnly = lookupPhone.replace(/\D/g, '');
      
      // Find user where phone number digits match
      const users = await db.collection('users').find({}).toArray();
      user = users.find(u => u.phone && u.phone.replace(/\D/g, '') === digitsOnly);
      
      if (user) {
        console.log('OTP bypass: Matched by digits -', 'Input:', lookupPhone, 'Found:', user.phone);
      }
    }

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

    // If OTP bypass was detected, return immediately after password verification
    if (shouldBypassOTP) {
      console.log('OTP bypass detected for phone:', phone);
      
      // Generate JWT token immediately
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        bypass: true,
        token,
        user: userWithoutPassword,
        message: 'OTP bypassed - logged in directly',
      });
    }

    // Format phone number - ensure it has international format
    let smsPhone = user.phone;
    
    // If phone doesn't start with +, try to add appropriate country code
    if (!smsPhone.startsWith('+')) {
      // If starts with 0, assume Ghana and convert
      if (smsPhone.startsWith('0')) {
        smsPhone = '+233' + smsPhone.substring(1);
      } 
      // If starts with 1 and is 10 digits, assume USA/Canada
      else if (smsPhone.startsWith('1') && smsPhone.length === 11) {
        smsPhone = '+' + smsPhone;
      }
      // If starts with country code but missing +, add it
      else if (smsPhone.length > 10) {
        smsPhone = '+' + smsPhone;
      }
      // Default to Ghana for shorter numbers
      else {
        smsPhone = '+233' + smsPhone;
      }
    }

    console.log('Original phone:', user.phone, 'SMS phone:', smsPhone);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in database with user's actual phone number from DB
    await db.collection('otps').updateOne(
      { phone: user.phone },
      {
        $set: {
          otp,
          expiresAt,
          verified: false,
          createdAt: new Date(),
          smsPhone,
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
              destinations: [{ to: smsPhone }],
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
