import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');

    const client = await clientPromise;
    const db = client.db('neoncapital');

    let query: any = {};
    if (userId) query.userId = userId;
    if (accountId) query.accountId = accountId;

    const transactions = await db.collection('transactions').find(query).sort({ date: -1 }).toArray();

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      userId,
      type,
      category,
      merchantName,
      amount,
      date,
      time,
      description,
    } = body;

    if (!accountId || !userId || !type || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const newTransaction = {
      accountId,
      userId,
      type,
      category,
      merchantName,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toTimeString().split(' ')[0],
      description,
      createdAt: new Date(),
    };

    const result = await db.collection('transactions').insertOne(newTransaction);

    // Update account balance
    const balanceChange = type === 'Income' ? parseFloat(amount) : -parseFloat(amount);
    await db.collection('accounts').updateOne(
      { _id: new ObjectId(accountId) },
      { $inc: { balance: balanceChange } }
    );

    return NextResponse.json({
      success: true,
      transaction: { ...newTransaction, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(transactionId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
