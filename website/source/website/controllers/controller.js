import UploadModel from '../models/schema.js';
import fs from 'fs';

export const home = async (req, res) => {
  try {
    const all_images = await UploadModel.find();
    res.json(all_images);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const filterByVersion = async (req, res) => {
  const versionNumber = req.params.version;
  try {
    const filteredImages = await UploadModel.find({ version: versionNumber });
    res.render('main', { images: filteredImages });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const userFiles = async (req, res) => {
  const userName = req.params.userName;
  try {
    const filteredImages = await UploadModel.find({ userName: userName });
    res.render('main', { images: filteredImages });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};



export const getAllDates = async (req, res) => {
  try {
    const dates = await UploadModel.distinct('date');
    res.json({ dates });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const uploads = (req, res, next) => {
  const files = req.files;

  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }

  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);
    let encode_image = img.toString('base64');
    return encode_image;
  });

  let result = imgArray.map((src, index) => {
    let finalImg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };

    let newUpload = new UploadModel(finalImg);

    return newUpload
      .save()
      .then(() => {
        return { msg: `${files[index].originalname} Uploaded Successfully...!` };
      })
      .catch((error) => {
        if (error) {
          if (error.name === 'MongoError' && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}. File Already exists! `,
            });
          }
          return Promise.reject({
            error:
              error.message || `Cannot Upload ${files[index].originalname} Something Missing!`,
          });
        }
      });
  });

  Promise.all(result)
    .then((msg) => {
      res.redirect('/');
    })
    .catch((err) => {
      res.json(err);
    });
};
