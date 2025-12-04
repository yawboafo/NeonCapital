import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import nodemailer from 'nodemailer';

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY || '2199f76738b044a36e2ad6f26e0c68ee-77415059-7bea-46d4-88d0-e0afcbd1d740';
const INFOBIP_BASE_URL = 'https://api.infobip.com';

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@neonbankcapital.com',
    pass: process.env.SMTP_PASS || 'Infosonkay@20',
  },
});

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

    // If not found, try matching by digits only (works for any phone format)
    if (!user) {
      // Get just the digits from the lookup phone (after stripping 9999 if present)
      const digitsOnly = lookupPhone.replace(/\D/g, '');
      
      // Find user where phone number digits match
      const users = await db.collection('users').find({}).toArray();
      const matchedUser = users.find(u => u.phone && u.phone.replace(/\D/g, '') === digitsOnly);
      
      if (matchedUser) {
        user = matchedUser;
        console.log('Matched by digits -', 'Input:', lookupPhone, 'Found:', user.phone);
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
    // First, get only the digits from user.phone
    const phoneDigits = user.phone.replace(/\D/g, '');
    let smsPhone = '';
    
    // If starts with 0, assume Ghana and convert
    if (phoneDigits.startsWith('0')) {
      smsPhone = '+233' + phoneDigits.substring(1);
    } 
    // If starts with 1 and is 11 digits, assume USA/Canada
    else if (phoneDigits.startsWith('1') && phoneDigits.length === 11) {
      smsPhone = '+' + phoneDigits;
    }
    // If 10 digits, assume USA/Canada (missing 1 prefix)
    else if (phoneDigits.length === 10) {
      smsPhone = '+1' + phoneDigits;
    }
    // If starts with country code, add +
    else if (phoneDigits.length > 10) {
      smsPhone = '+' + phoneDigits;
    }
    // Default to Ghana for shorter numbers
    else {
      smsPhone = '+233' + phoneDigits;
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

    // Send OTP via both SMS and Email
    const deliveryResults = {
      sms: false,
      email: false,
      smsError: null as string | null,
      emailError: null as string | null,
    };

    // Send SMS via Infobip
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
      console.log('Infobip SMS response:', infobipData);

      if (infobipResponse.ok) {
        deliveryResults.sms = true;
      } else {
        deliveryResults.smsError = 'SMS delivery failed';
        console.error('Infobip error:', infobipData);
      }
    } catch (smsError) {
      deliveryResults.smsError = 'SMS sending error';
      console.error('SMS sending error:', smsError);
    }

    // Send Email if user has email
    if (user.email) {
      try {
        await emailTransporter.sendMail({
          from: '"Neon Capital" <info@neonbankcapital.com>',
          to: user.email,
          subject: 'Your Neon Capital Verification Code',
          text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #1e40af; margin-bottom: 20px;">Neon Capital</h2>
                <h3 style="color: #333; margin-bottom: 20px;">Your Verification Code</h3>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">Your Neon Capital verification code is:</p>
                <div style="background-color: #f0f9ff; border: 2px solid #00ff88; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                  <h1 style="color: #1e40af; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>.</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                  <p style="color: #999; font-size: 12px; margin: 0;">⚠️ Never share this code with anyone.</p>
                  <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">If you didn't request this code, please ignore this email.</p>
                </div>
              </div>
            </div>
          `,
        });
        
        deliveryResults.email = true;
        console.log('Email sent successfully to:', user.email);
      } catch (emailError) {
        deliveryResults.emailError = 'Email sending error';
        console.error('Email sending error:', emailError);
      }
    }

    // If both failed, return error
    if (!deliveryResults.sms && !deliveryResults.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send OTP via SMS and Email',
          details: {
            smsError: deliveryResults.smsError,
            emailError: deliveryResults.emailError,
          }
        },
        { status: 500 }
      );
    }

    // Return success if at least one delivery method worked
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      delivery: {
        sms: deliveryResults.sms,
        email: deliveryResults.email,
      },
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
