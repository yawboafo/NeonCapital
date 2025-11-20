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
    const { 
      userId, 
      accountId,
      fromAccount,
      toAccount,
      recipientName, 
      recipientEmail,
      recipientIban,
      amount, 
      date,
      purpose,
      reference,
      notes,
      status 
    } = body;

    if (!userId || !amount || !recipientIban || !accountId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('neoncapital');

    const transferAmount = parseFloat(amount);

    // Get the account to check balance and get details
    const account = await db.collection('accounts').findOne({ 
      _id: new ObjectId(accountId),
      userId: userId
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Check sufficient balance
    if (account.balance < transferAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    // Create transfer record
    const transfer = {
      userId,
      accountId,
      fromAccount: fromAccount || account.accountName,
      toAccount: toAccount || recipientIban,
      recipientName: recipientName || 'N/A',
      recipientEmail: recipientEmail || '',
      recipientIban: recipientIban,
      amount: transferAmount,
      date: date || new Date().toISOString().split('T')[0],
      purpose: purpose || '',
      reference: reference || '',
      notes: notes || '',
      status: status || 'Completed',
      createdAt: new Date()
    };

    const transferResult = await db.collection('transfers').insertOne(transfer);

    // Create transaction record
    const transaction = {
      userId,
      accountId,
      type: 'expense',
      category: 'Transfer',
      amount: transferAmount,
      description: `Transfer to ${recipientName || recipientIban}${purpose ? ' - ' + purpose : ''}`,
      date: date || new Date().toISOString().split('T')[0],
      reference: reference || `TRF-${transferResult.insertedId.toString().slice(-8).toUpperCase()}`,
      status: 'Completed',
      createdAt: new Date()
    };

    await db.collection('transactions').insertOne(transaction);

    // Update account balance (deduct transfer amount)
    const newBalance = account.balance - transferAmount;
    await db.collection('accounts').updateOne(
      { _id: new ObjectId(accountId) },
      { 
        $set: { balance: newBalance },
        $currentDate: { updatedAt: true }
      }
    );

    return NextResponse.json({
      success: true,
      transfer: { ...transfer, _id: transferResult.insertedId.toString() },
      newBalance: newBalance
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
