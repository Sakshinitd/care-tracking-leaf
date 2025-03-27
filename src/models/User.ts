import mongoose from 'mongoose';

// Define the User schema
const UserSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['careworker', 'manager'],
    default: 'careworker'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Create and export the User model
// Use mongoose.models to check if the model already exists to avoid the "Cannot overwrite model" error
export default mongoose.models.User || mongoose.model('User', UserSchema); 