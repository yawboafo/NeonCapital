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
    
    if (accountId) {
      query.accountId = accountId;
    } else if (userId) {
      // If userId is provided without accountId, get all accounts for this user first
      const accounts = await db.collection('accounts').find({ userId }).toArray();
      const accountIds = accounts.map(acc => acc._id.toString());
      query.accountId = { $in: accountIds };
    }

    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
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
      status,
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
      status: status || 'success',
      createdAt: new Date(),
    };

    const result = await db.collection('transactions').insertOne(newTransaction);

    // Update account balance only if transaction is not failed
    if ((status || 'success') !== 'failed') {
      const balanceChange = (type.toLowerCase() === 'income') ? parseFloat(amount) : -parseFloat(amount);
      await db.collection('accounts').updateOne(
        { _id: new ObjectId(accountId) },
        { $inc: { balance: balanceChange } }
      );
    }

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      _id,
      accountId,
      userId,
      type,
      category,
      merchantName,
      amount,
      date,
      time,
      description,
      status,
    } = body;

    if (!_id || !accountId || !userId || !type || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    // Get the old transaction to calculate balance adjustments
    const oldTransaction = await db.collection('transactions').findOne({ _id: new ObjectId(_id) });

    if (!oldTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Reverse the old transaction's balance effect (only if it wasn't failed)
    const oldBalanceChange = (oldTransaction.status !== 'failed') 
      ? ((oldTransaction.type.toLowerCase() === 'income') 
        ? -parseFloat(oldTransaction.amount) 
        : parseFloat(oldTransaction.amount))
      : 0;

    // Apply the new transaction's balance effect (only if it's not failed)
    const newBalanceChange = ((status || 'success') !== 'failed')
      ? ((type.toLowerCase() === 'income') 
        ? parseFloat(amount) 
        : -parseFloat(amount))
      : 0;

    // Net balance change
    const netBalanceChange = oldBalanceChange + newBalanceChange;

    // Update the transaction
    const updatedTransaction = {
      accountId,
      userId,
      type,
      category,
      merchantName,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toTimeString().split(' ')[0],
      description,
      status: status || 'success',
      updatedAt: new Date(),
    };

    await db.collection('transactions').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedTransaction }
    );

    // Update account balance if there's a net change
    if (netBalanceChange !== 0) {
      // If account changed, we need to reverse from old and apply to new
      if (oldTransaction.accountId !== accountId) {
        // Reverse old account
        await db.collection('accounts').updateOne(
          { _id: new ObjectId(oldTransaction.accountId) },
          { $inc: { balance: oldBalanceChange } }
        );
        // Apply to new account
        await db.collection('accounts').updateOne(
          { _id: new ObjectId(accountId) },
          { $inc: { balance: newBalanceChange } }
        );
      } else {
        // Same account, just apply net change
        await db.collection('accounts').updateOne(
          { _id: new ObjectId(accountId) },
          { $inc: { balance: netBalanceChange } }
        );
      }
    } else if (oldTransaction.accountId !== accountId) {
      // Account changed but amount/type stayed same
      await db.collection('accounts').updateOne(
        { _id: new ObjectId(oldTransaction.accountId) },
        { $inc: { balance: oldBalanceChange } }
      );
      await db.collection('accounts').updateOne(
        { _id: new ObjectId(accountId) },
        { $inc: { balance: newBalanceChange } }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: { ...updatedTransaction, _id },
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
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

    // First, get the transaction to reverse the balance
    const transaction = await db.collection('transactions').findOne({ _id: new ObjectId(transactionId) });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete the transaction
    const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(transactionId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Reverse the balance change
    // If it was income, subtract it. If it was expense, add it back
    const balanceChange = (transaction.type.toLowerCase() === 'income') ? -parseFloat(transaction.amount) : parseFloat(transaction.amount);
    await db.collection('accounts').updateOne(
      { _id: new ObjectId(transaction.accountId) },
      { $inc: { balance: balanceChange } }
    );

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
