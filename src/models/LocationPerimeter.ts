import mongoose from 'mongoose';

// Define the LocationPerimeter schema
const LocationPerimeterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  radiusInMeters: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Create and export the LocationPerimeter model
export default mongoose.models.LocationPerimeter || 
  mongoose.model('LocationPerimeter', LocationPerimeterSchema); 