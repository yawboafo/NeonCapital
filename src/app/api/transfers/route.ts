import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db('neoncapital');

    let query = {};
    if (userId) {
      query = { userId };
    }

    const transfers = await db.collection('transfers').find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      transfers: transfers.map(transfer => ({
        ...transfer,
        _id: transfer._id.toString()
      }))
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, recipientName, recipientAccount, amount, currency, type, status } = body;

    if (!userId || !recipientName || !recipientAccount || !amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const transfer = {
      userId,
      recipientName,
      recipientAccount,
      amount: parseFloat(amount),
      currency,
      type: type || 'International',
      status: status || 'Pending',
      transferDate: new Date().toISOString(),
      createdAt: new Date()
    };

    const result = await db.collection('transfers').insertOne(transfer);

    return NextResponse.json({
      success: true,
      transfer: { ...transfer, _id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Create transfer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transfer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Transfer ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);
    updateData.updatedAt = new Date();

    const result = await db.collection('transfers').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Transfer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update transfer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transfer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transfer ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const result = await db.collection('transfers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Transfer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete transfer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transfer' },
      { status: 500 }
    );
  }
}
