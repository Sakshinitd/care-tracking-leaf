import mongoose from 'mongoose';

// Define the location point schema
const LocationPointSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
});

// Define the ClockRecord schema
const ClockRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clockInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  clockInLocation: {
    type: LocationPointSchema,
    required: true
  },
  clockInNote: {
    type: String
  },
  clockOutTime: {
    type: Date
  },
  clockOutLocation: {
    type: LocationPointSchema
  },
  clockOutNote: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Create and export the ClockRecord model
export default mongoose.models.ClockRecord || 
  mongoose.model('ClockRecord', ClockRecordSchema); 