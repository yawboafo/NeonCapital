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

    const cards = await db.collection('cards').find(query).toArray();

    return NextResponse.json({
      success: true,
      cards: cards.map(card => ({
        ...card,
        _id: card._id.toString()
      }))
    });
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cardType, cardNumber, cardHolderName, expiryDate, cvv, limit, balance } = body;

    if (!userId || !cardType || !cardNumber || !cardHolderName || !expiryDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const card = {
      userId,
      cardType,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv: cvv || '***',
      limit: limit ? parseFloat(limit) : 5000,
      balance: balance ? parseFloat(balance) : 0,
      status: 'Active',
      createdAt: new Date()
    };

    const result = await db.collection('cards').insertOne(card);

    return NextResponse.json({
      success: true,
      card: { ...card, _id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Create card error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create card' },
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
        { success: false, error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    if (updateData.limit) updateData.limit = parseFloat(updateData.limit);
    if (updateData.balance) updateData.balance = parseFloat(updateData.balance);

    updateData.updatedAt = new Date();

    const result = await db.collection('cards').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update card error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update card' },
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
        { success: false, error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const result = await db.collection('cards').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete card error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}
