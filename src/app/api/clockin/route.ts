import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import connectToDatabase from '@/lib/mongodb';
import ClockRecord from '@/models/ClockRecord';
import User from '@/models/User';
import LocationPerimeter from '@/models/LocationPerimeter';
import { isWithinPerimeter } from '@/lib/geolocation';

export async function POST(req: NextRequest) {
  const session = await getSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { latitude, longitude, locationPerimeterId, note } = await req.json();

    if (!latitude || !longitude || !locationPerimeterId) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude, or locationPerimeterId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the location perimeter
    const locationPerimeter = await LocationPerimeter.findById(locationPerimeterId);
    
    if (!locationPerimeter) {
      return NextResponse.json({ error: 'Location perimeter not found' }, { status: 404 });
    }

    // Check if user is already clocked in
    const existingClockIn = await ClockRecord.findOne({
      userId: user._id,
      clockOutTime: { $exists: false }
    });

    if (existingClockIn) {
      return NextResponse.json(
        { error: 'You are already clocked in. Please clock out first.' },
        { status: 400 }
      );
    }

    // Check if user is within perimeter
    const isInside = isWithinPerimeter(
      { latitude, longitude },
      { 
        latitude: locationPerimeter.latitude, 
        longitude: locationPerimeter.longitude 
      },
      locationPerimeter.radiusInMeters
    );

    if (!isInside) {
      return NextResponse.json(
        { 
          error: 'You are outside the allowed perimeter for clock-in',
          isInPerimeter: false
        },
        { status: 400 }
      );
    }

    // Create new clock record
    const clockRecord = new ClockRecord({
      userId: user._id,
      clockInTime: new Date(),
      clockInLocation: { latitude, longitude },
      clockInNote: note,
      locationPerimeterId
    });

    await clockRecord.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully clocked in',
      clockRecord
    });
  } catch (error) {
    console.error('Clock in error:', error);
    return NextResponse.json(
      { error: 'An error occurred during clock in' },
      { status: 500 }
    );
  }
} 