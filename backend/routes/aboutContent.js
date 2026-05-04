const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const multer = require('multer');
const path = require('path');

/* ------------------- MULTER SETUP ------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
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

/* ------------------- GET ABOUT CONTENT ------------------- */
router.get('/', async (req, res) => {
  try {
    // Get the most recent about content
    const content = await AboutContent.findOne().sort({ createdAt: -1 });
    if (!content) {
      // Return default content if none exists
      return res.json({
        missionVision: "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care.",
        hospitalProfile: "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals.",
        hospitalPhoto: '/images/hospital-default.jpg',
        chairmanMessage: '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman',
        chairmanPhoto: '/images/chairman-default.jpg',
        chairmanName: 'Chairman Name',
        medicalDirectorMessage: '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director',
        medicalDirectorPhoto: '/images/medical-director-default.jpg',
        medicalDirectorName: 'Medical Director Name',
        boardOfDirectors: [
          { name: "Director 1", photo: "/images/director-default.jpg" },
          { name: "Director 2", photo: "/images/director-default.jpg" },
          { name: "Director 3", photo: "/images/director-default.jpg" }
        ],
        managementTeam: [
          { name: "CEO", photo: "/images/team-member-default.jpg" },
          { name: "Hospital Administrator", photo: "/images/team-member-default.jpg" },
          { name: "Nursing Director", photo: "/images/team-member-default.jpg" }
        ],
        awards: [
          { title: "Example Award 1", description: "Description for Example Award 1", photo: "/images/award-default.jpg" },
          { title: "Example Award 2", description: "Description for Example Award 2", photo: "/images/award-default.jpg" }
        ]
      });
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------- UPDATE ABOUT CONTENT ------------------- */
router.put('/', async (req, res) => {
  try {
    let content = await AboutContent.findOne().sort({ createdAt: -1 });

    const body = { ...req.body };
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    if (content) {
      // Update existing content
      Object.assign(content, body);
      await content.save();
    } else {
      // Create new content if none exists
      content = await AboutContent.create(body);
    }

    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message, error: err.name });
  }
});

/* ------------------- FILE UPLOADS ------------------- */
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  res.json({ message: 'Image uploaded successfully', imagePath: `/images/${req.file.filename}` });
});

module.exports = router;