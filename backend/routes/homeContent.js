const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const multer = require('multer');
const path = require('path');

/* ------------------- MULTER SETUP ------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, path.join(__dirname, '../../frontend/public/videos'));
    } else if (file.fieldname === 'image') {
      cb(null, path.join(__dirname, '../../frontend/public/images'));
    } else {
      cb(null, path.join(__dirname, '../../frontend/public/uploads'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* ------------------- HELPERS ------------------- */
const mergeDetailedContent = (existing = {}, incoming = {}) => {
  return {
    about: incoming.about ?? existing.about ?? '',
    aboutHeading: incoming.aboutHeading ?? existing.aboutHeading ?? 'About This Service',
    whyChoose: incoming.whyChoose ?? existing.whyChoose ?? '',
    whyChooseHeading: incoming.whyChooseHeading ?? existing.whyChooseHeading ?? 'Why Choose Our Services?',
    image1Path: incoming.image1Path ?? existing.image1Path ?? '',
    image2Path: incoming.image2Path ?? existing.image2Path ?? '',
    doctors: Array.isArray(incoming.doctors)
      ? incoming.doctors
      : Array.isArray(existing.doctors)
        ? existing.doctors
        : []
  };
};

/* ------------------- GET CONTENT ------------------- */
router.get('/', async (req, res) => {
  try {
    const content = await HomeContent.findOne().sort({ createdAt: -1 });
    if (!content) return res.json({});
    if (content.videoPath?.startsWith('blob:')) content.videoPath = '/videos/hospital-tour.mp4';
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------- UPDATE CONTENT ------------------- */
router.put('/', async (req, res) => {
  try {
    let content = await HomeContent.findOne().sort({ createdAt: -1 });

    const body = { ...req.body };
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    if (body.videoPath?.startsWith('blob:')) body.videoPath = '/videos/hospital-tour.mp4';

    /* -------- SERVICES -------- */
    if (Array.isArray(body.services)) {
      body.services = body.services.map(service => ({
        title: service.title || '',
        description: service.description || '',
        imageUrl: service.imageUrl || '',
        detailedContent: service.detailedContent || {}
      }));
    }
    




    if (content) {
      Object.assign(content, body);
      await content.save();
    } else {
      content = await HomeContent.create(body);
    }

    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message, error: err.name });
  }
});

/* ------------------- FILE UPLOADS ------------------- */
router.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
  res.json({ message: 'Video uploaded successfully', videoPath: `/videos/${req.file.filename}` });
});

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  res.json({ message: 'Image uploaded successfully', imagePath: `/images/${req.file.filename}` });
});

/* ------------------- CLEAR ALL ------------------- */
router.get('/clear-all', async (req, res) => {
  await HomeContent.deleteMany({});
  res.json({ message: 'All home content cleared successfully' });
});

module.exports = router;
