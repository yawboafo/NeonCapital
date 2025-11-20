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

    const investments = await db.collection('investments').find(query).toArray();

    return NextResponse.json({
      success: true,
      investments: investments.map(inv => ({
        ...inv,
        _id: inv._id.toString()
      }))
    });
  } catch (error) {
    console.error('Get investments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assetName, assetType, quantity, purchasePrice, currentPrice, purchaseDate } = body;

    if (!userId || !assetName || !assetType || !quantity || !purchasePrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const investment = {
      userId,
      assetName,
      assetType,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(purchasePrice),
      purchaseDate: purchaseDate || new Date().toISOString(),
      createdAt: new Date()
    };

    const result = await db.collection('investments').insertOne(investment);

    return NextResponse.json({
      success: true,
      investment: { ...investment, _id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Create investment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create investment' },
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
        { success: false, error: 'Investment ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    if (updateData.quantity) updateData.quantity = parseFloat(updateData.quantity);
    if (updateData.purchasePrice) updateData.purchasePrice = parseFloat(updateData.purchasePrice);
    if (updateData.currentPrice) updateData.currentPrice = parseFloat(updateData.currentPrice);

    updateData.updatedAt = new Date();

    const result = await db.collection('investments').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Investment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update investment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update investment' },
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
        { success: false, error: 'Investment ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const result = await db.collection('investments').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Investment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete investment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete investment' },
      { status: 500 }
    );
  }
}
