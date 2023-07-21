import express from 'express';
import { home, filterByVersion, uploads, getAllDates } from '../controllers/controller.js';
import store from '../middleware/multer.js';

const route = express.Router();

// routes
route.get('/', home);
route.get('/filter/:version', filterByVersion);
route.post('/uploadmultiple', store.array('files', 12), uploads); // Update the field name to 'files'
route.get('/dates', getAllDates);

export default route;
