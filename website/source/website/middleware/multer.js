import multer from 'multer';

// Set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const store = multer({ storage });

export default store;
