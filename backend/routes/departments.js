const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../frontend/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// --- DATA PROCESSOR ---
const processDepartmentData = (req) => {
  const updateData = { ...req.body };

  const safeParse = (val) => {
    if (!val || val === "undefined" || val === "null" || val === "") return [];
    try {
      return JSON.parse(val);
    } catch (e) {
      return [];
    }
  };

  updateData.doctors = safeParse(updateData.doctors);

  // Main Image
  const mainImage = req.files?.find((f) => f.fieldname === "image");
  if (mainImage) updateData.image = `/images/${mainImage.filename}`;

const iconImage = req.files?.find((f) => f.fieldname === "imageIcon");
  if (iconImage) updateData.imageIcon = `/images/${iconImage.filename}`;

  // Doctor Images
  if (Array.isArray(updateData.doctors)) {
    updateData.doctors = updateData.doctors.map((doc, index) => {
      const docFile = req.files?.find(
        (f) => f.fieldname === `doctor_image_${index}`,
      );
      if (docFile) doc.image = `/images/${docFile.filename}`;
      return doc;
    });
  }

  return updateData;
};

/* ROUTES */

router.get("/", async (req, res) => {
  const depts = await Department.find().sort({ createdAt: -1 });
  res.json(depts);
});

router.get("/:id", async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    res.json(dept);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", upload.any(), async (req, res) => {
  try {
    const data = processDepartmentData(req);
    const newDept = new Department(data);
    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.any(), async (req, res) => {
  try {
    const data = processDepartmentData(req);
    const updated = await Department.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
