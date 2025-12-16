import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Get current user
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Toggle the showWarning field
    const newWarningState = !user.showWarning;

    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          showWarning: newWarningState,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      showWarning: newWarningState,
    });
  } catch (error) {
    console.error('Error toggling warning:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle warning' },
      { status: 500 }
    );
  }
}
