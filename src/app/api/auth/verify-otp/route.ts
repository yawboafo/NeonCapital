import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    console.log('Verify OTP attempt - Phone:', phone);

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Find OTP record by phone
    const otpRecord = await db.collection('otps').findOne({ phone });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is already verified
    if (otpRecord.verified) {
      return NextResponse.json(
        { success: false, error: 'OTP has already been used.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code.' },
        { status: 401 }
      );
    }

    // Mark OTP as verified
    await db.collection('otps').updateOne(
      { phone },
      { $set: { verified: true } }
    );

    // Get user data
    const user = await db.collection('users').findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
