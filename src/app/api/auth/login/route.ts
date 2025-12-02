import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    console.log('Login attempt - Phone:', phone);

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Find user by phone - try exact match first
    let user = await db.collection('users').findOne({ phone });

    console.log('User found (exact match):', user ? 'Yes' : 'No');

    // If not found, try comparing by digits only
    if (!user) {
      const phoneDigits = phone.replace(/\D/g, '');
      const users = await db.collection('users').find({}).toArray();
      const matchedUser = users.find(u => u.phone && u.phone.replace(/\D/g, '') === phoneDigits);
      if (matchedUser) {
        user = matchedUser;
        console.log('User found (digits match):', 'Yes');
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials - User not found' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Comparing password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials - Wrong password' },
        { status: 401 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
