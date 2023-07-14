import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  token: {
    type: String
  },
  expiration: {
    type: Date
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }
});

export default mongoose.model('User', userSchema);
