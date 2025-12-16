import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Update the warning message
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          warningMessage: message,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Warning message updated successfully',
    });
  } catch (error) {
    console.error('Error updating warning message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update warning message' },
      { status: 500 }
    );
  }
}
