import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  token: {
    type: String
  },
  expiration: {
    type: Date
  }
});

export default mongoose.model('Session', sessionSchema);
