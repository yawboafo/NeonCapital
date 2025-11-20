import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    const client = await clientPromise;
    const db = client.db('neoncapital');

    if (phone) {
      const user = await db.collection('users').findOne({ phone });
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: 'User not found',
          phone: phone 
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          hasPassword: !!user.password,
          passwordLength: user.password?.length || 0,
          passwordPrefix: user.password?.substring(0, 10) || 'N/A'
        }
      });
    }

    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        hasPassword: !!u.password
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch debug info' },
      { status: 500 }
    );
  }
}
