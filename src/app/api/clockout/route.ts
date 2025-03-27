import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import ClockRecord from '@/models/ClockRecord';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const session = await getSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { latitude, longitude, note } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find active clock in record for the user
    const clockRecord = await ClockRecord.findOne({
      userId: user._id,
      clockOutTime: { $exists: false }
    });

    if (!clockRecord) {
      return NextResponse.json(
        { error: 'No active clock-in record found. Please clock in first.' },
        { status: 400 }
      );
    }

    // Update the clock record with clock out details
    clockRecord.clockOutTime = new Date();
    clockRecord.clockOutLocation = { latitude, longitude };
    clockRecord.clockOutNote = note;

    await clockRecord.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully clocked out',
      clockRecord
    });
  } catch (error) {
    console.error('Clock out error:', error);
    return NextResponse.json(
      { error: 'An error occurred during clock out' },
      { status: 500 }
    );
  }
} 