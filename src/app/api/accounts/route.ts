import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all accounts or accounts for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db('neoncapital');

    let accounts;
    if (userId) {
      accounts = await db.collection('accounts').find({ userId }).toArray();
    } else {
      accounts = await db.collection('accounts').find({}).toArray();
    }

    return NextResponse.json({ success: true, accounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST - Create a new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      accountType,
      accountName,
      currency,
      initialBalance,
      iban,
      sortCode,
      accountNumber,
      interestRate,
    } = body;

    if (!userId || !accountType || !accountName || !currency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const newAccount = {
      userId,
      accountType,
      accountName,
      currency,
      balance: parseFloat(initialBalance) || 0,
      iban,
      sortCode,
      accountNumber,
      interestRate: parseFloat(interestRate) || 0,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('accounts').insertOne(newAccount);

    return NextResponse.json({
      success: true,
      account: { ...newAccount, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

// PUT - Update account
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    updateData.updatedAt = new Date();

    const result = await db.collection('accounts').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Account updated successfully' });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE - Delete account
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const result = await db.collection('accounts').deleteOne({ _id: new ObjectId(accountId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
