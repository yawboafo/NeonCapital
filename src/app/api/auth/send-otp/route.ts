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
        const userName = user.firstName || user.name?.split(' ')[0] || 'Valued Customer';
        
        await emailTransporter.sendMail({
          from: '"Neon Capital Bank" <info@neonbankcapital.com>',
          to: user.email,
          subject: 'Your Neon Capital Bank Security Code',
          text: `Dear ${userName},\n\nYour one-time verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nFor your security, never share this code with anyone, including Neon Capital Bank staff.\n\nIf you did not request this code, please contact our support team immediately.\n\nBest regards,\nNeon Capital Bank Security Team\n\nThis is an automated message. Please do not reply to this email.`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Neon Capital Bank - Security Code</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                            Neon Capital Bank
                          </h1>
                          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                            Secure Banking Solutions
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                          <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                            Hello ${userName},
                          </h2>
                          <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                            You requested a one-time verification code to access your Neon Capital Bank account. Please use the code below to complete your login:
                          </p>
                          
                          <!-- OTP Code Box -->
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                            <tr>
                              <td style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #3b82f6; border-radius: 10px; padding: 24px; text-align: center;">
                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                  Your Verification Code
                                </p>
                                <p style="margin: 0; color: #1e40af; font-size: 42px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                                  ${otp}
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            <strong style="color: #ef4444;">⏱️ This code will expire in 10 minutes.</strong> For your security, please do not share this code with anyone.
                          </p>
                          
                          <!-- Security Notice -->
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                            <tr>
                              <td style="padding: 16px 20px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                  <strong>🔒 Security Reminder:</strong><br>
                                  Neon Capital Bank will never ask you to share your verification code via phone, email, or text message. If you did not request this code, please contact our support team immediately.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f9fafb; padding: 32px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Best regards,<br>
                            <strong style="color: #1f2937;">Neon Capital Bank Security Team</strong>
                          </p>
                          
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0 16px 0;">
                            <tr>
                              <td style="text-align: center; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                  Need Help?
                                </p>
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                  support@neonbankcapital.com
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 11px; line-height: 1.5; text-align: center;">
                            This is an automated message from Neon Capital Bank. Please do not reply to this email.<br>
                            © ${new Date().getFullYear()} Neon Capital Bank. All rights reserved.<br>
                            <span style="color: #d1d5db;">|</span> FDIC Insured <span style="color: #d1d5db;">|</span> Member FDIC <span style="color: #d1d5db;">|</span> Equal Housing Lender
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
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
