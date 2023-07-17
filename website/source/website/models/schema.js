import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    unique: true,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  imageBase64: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
  // userName: {
  //   type: String,
  //   unique: true,
  //   required: false
  // }
});

const UploadModel = mongoose.model('uploads', uploadSchema);

export default UploadModel;
