import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import LocationPerimeter from '@/models/LocationPerimeter';

interface Session {
  user?: {
    sub: string;
    email?: string;
    name?: string;
  };
}

// Get all location perimeters
export async function GET() {
  const session = (await getSession()) as Session | null;
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only managers can view all locations
    if (user.role !== 'manager') {
      return NextResponse.json({ error: 'Unauthorized. Managers only.' }, { status: 403 });
    }

    const locations = await LocationPerimeter.find();
    
    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Location fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching locations' },
      { status: 500 }
    );
  }
}

// Create a new location perimeter
export async function POST(req: NextRequest) {
  const session = (await getSession()) as Session | null;
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { name, latitude, longitude, radiusInMeters } = await req.json();

    if (!name || !latitude || !longitude || !radiusInMeters) {
      return NextResponse.json(
        { error: 'Missing required fields: name, latitude, longitude, radiusInMeters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only managers can create locations
    if (user.role !== 'manager') {
      return NextResponse.json({ error: 'Unauthorized. Managers only.' }, { status: 403 });
    }

    // Create new location perimeter
    const locationPerimeter = new LocationPerimeter({
      name,
      latitude,
      longitude,
      radiusInMeters,
      createdBy: user._id
    });

    await locationPerimeter.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Location perimeter created successfully',
      locationPerimeter
    });
  } catch (error) {
    console.error('Location creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred creating location' },
      { status: 500 }
    );
  }
}

// PUT to update a location perimeter
export async function PUT(req: NextRequest) {
  const session = (await getSession()) as Session | null;
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id, name, latitude, longitude, radiusInMeters } = await req.json();

    if (!id || !name || !latitude || !longitude || !radiusInMeters) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, latitude, longitude, radiusInMeters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only managers can update locations
    if (user.role !== 'manager') {
      return NextResponse.json({ error: 'Unauthorized. Managers only.' }, { status: 403 });
    }

    const locationPerimeter = await LocationPerimeter.findById(id);
    
    if (!locationPerimeter) {
      return NextResponse.json({ error: 'Location perimeter not found' }, { status: 404 });
    }

    // Update location perimeter
    locationPerimeter.name = name;
    locationPerimeter.latitude = latitude;
    locationPerimeter.longitude = longitude;
    locationPerimeter.radiusInMeters = radiusInMeters;

    await locationPerimeter.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Location perimeter updated successfully',
      locationPerimeter
    });
  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating location' },
      { status: 500 }
    );
  }
}

// DELETE to remove a location perimeter
export async function DELETE(req: NextRequest) {
  const session = (await getSession()) as Session | null;
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user from Auth0 ID
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only managers can delete locations
    if (user.role !== 'manager') {
      return NextResponse.json({ error: 'Unauthorized. Managers only.' }, { status: 403 });
    }

    const locationPerimeter = await LocationPerimeter.findById(id);
    
    if (!locationPerimeter) {
      return NextResponse.json({ error: 'Location perimeter not found' }, { status: 404 });
    }

    await locationPerimeter.deleteOne();

    return NextResponse.json({ 
      success: true, 
      message: 'Location perimeter deleted successfully'
    });
  } catch (error) {
    console.error('Location deletion error:', error);
    return NextResponse.json(
      { error: 'An error occurred deleting location' },
      { status: 500 }
    );
  }
} 