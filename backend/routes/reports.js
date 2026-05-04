const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");
const heicConvert = require("heic-convert"); // ← top level, same fix
const Report = require("../models/Report");

// 1. Configure Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ------------------- ADMIN: CREATE REPORT ------------------- */
router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const { title, description, showInSection, navLabel } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileData = req.files.map((file) => ({
      fileName: file.originalname,
      fileId: file.filename, // ← the unique disk name
      fileType: file.mimetype,
    }));

    const newReport = new Report({
      title,
      description,
      files: fileData,
      showInSection: showInSection === "true",
      navLabel: navLabel || "Reports",
      createdBy: "Hospital",
    });

    await newReport.save();
    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ------------------- SERVE FILE ------------------- */
router.get("/file/:fileId", async (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(__dirname, "../public/uploads", fileId);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const isDownload = req.query.download === "true";

  if (isDownload) {
    return res.download(filePath);
  }

  const ext = path.extname(fileId).toLowerCase();

  // ── XLSX/XLS: convert to styled HTML using SheetJS ──
  // Google Sheets viewer strips all colors/charts. SheetJS preserves cell colors,
  // borders, column widths, and number formatting — rendered server-side as HTML.
  if (ext === ".xlsx" || ext === ".xls") {
    try {
      const XLSX = require("xlsx");
      const workbook = XLSX.readFile(filePath, {
        cellStyles: true,
        cellNF: true,
        cellDates: true,
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Use SheetJS built-in HTML conversion which preserves cell values and basic structure
      const rawHtml = XLSX.utils.sheet_to_html(sheet, { editable: false });

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 13px;
      margin: 0;
      padding: 16px;
      background: #fff;
      color: #000;
    }
    table {
      border-collapse: collapse;
      width: auto;
      min-width: 100%;
    }
    td, th {
      border: 1px solid #d0d0d0;
      padding: 4px 8px;
      white-space: nowrap;
      vertical-align: middle;
      min-width: 60px;
    }
    tr:first-child td, tr:first-child th {
      background: #f2f2f2;
      font-weight: bold;
    }
    /* Zebra stripe for readability */
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
  </style>
</head>
<body>${rawHtml}</body>
</html>`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    } catch (err) {
      console.error("XLSX conversion failed:", err.message || err);
      return res
        .status(500)
        .json({ message: `XLSX conversion failed: ${err.message}` });
    }
  }

  // ── DOCX/DOC: convert to HTML on-the-fly using mammoth ──
  // Browsers cannot render Word documents. mammoth converts them to clean HTML
  // which is sent back as a full HTML page — no external server needed.
  if (ext === ".docx" || ext === ".doc") {
    try {
      const docBuffer = fs.readFileSync(filePath);
      console.log(`[DOCX] Converting: ${filePath} (${docBuffer.length} bytes)`);
      const result = await mammoth.convertToHtml({ buffer: docBuffer });
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      max-width: 860px;
      margin: 40px auto;
      padding: 0 30px 60px;
      line-height: 1.7;
      color: #1e293b;
      font-size: 15px;
    }
    h1,h2,h3,h4 { color: #0f172a; margin-top: 1.4em; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    td, th { border: 1px solid #cbd5e1; padding: 8px 12px; }
    th { background: #f1f5f9; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    p  { margin: 0.6em 0; }
  </style>
</head>
<body>${result.value}</body>
</html>`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    } catch (err) {
      console.error("DOCX conversion failed:", err.message || err);
      return res
        .status(500)
        .json({ message: `DOCX conversion failed: ${err.message}` });
    }
  }

  // ── HEIC: convert to JPEG on-the-fly, browsers cannot display HEIC natively ──
  if (ext === ".heic" || ext === ".heif") {
    try {
      const inputBuffer = fs.readFileSync(filePath);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.92,
      });
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", "inline");
      return res.send(Buffer.from(outputBuffer));
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      return res
        .status(500)
        .json({ message: "HEIC conversion failed. Try downloading the file." });
    }
  }

  const mimeTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    // DOCX/XLSX/PPTX are NOT added here — browsers cannot render them.
    // The frontend will use Microsoft Office Online viewer for these instead.
  };

  const mimeType = mimeTypes[ext] || "application/octet-stream";

  // Content-Disposition: inline  → tells the browser to DISPLAY, not download
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${fileId}"`);

  // For video files, support HTTP Range requests (needed for seeking in <video>)
  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": mimeType,
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": mimeType,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // Non-video: send normally
  res.sendFile(filePath);
});

/* ------------------- ADMIN: DELETE SINGLE FILE FROM REPORT ------------------- */
router.delete("/:id/file/:fileId", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const filePath = path.join(
      __dirname,
      "../public/uploads",
      req.params.fileId,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    report.files = report.files.filter((f) => f.fileId !== req.params.fileId);
    await report.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------- ADMIN: DELETE ENTIRE REPORT ------------------- */
// FIX: This route was completely missing — the frontend called it but got 404.
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Delete every physical file from disk
    report.files.forEach((file) => {
      const filePath = path.join(__dirname, "../public/uploads", file.fileId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------- VISIBILITY TOGGLE ------------------- */
// IMPORTANT: This must be defined BEFORE router.patch('/:id') below,
// otherwise Express treats "visibility" as the :id parameter and hits the wrong handler.
router.patch("/visibility", async (req, res) => {
  try {
    const { shouldShow, navLabel } = req.body;
    await Report.updateMany(
      {},
      {
        showInSection: shouldShow,
        navLabel: navLabel || "Reports",
      },
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
});

/* ------------------- GET REPORTS (User) ------------------- */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    const latestReport = reports[0];
    res.json({
      navLabel: latestReport ? latestReport.navLabel : "Reports",
      shouldShow: latestReport ? latestReport.showInSection : false,
      reports: latestReport && latestReport.showInSection ? reports : [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------- GET ALL REPORTS (Admin) ------------------- */
router.get("/admin/all", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    const latestReport = reports[0];
    res.json({
      navLabel: latestReport ? latestReport.navLabel : "Reports",
      shouldShow: latestReport ? latestReport.showInSection : false,
      reports,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------- ADMIN: EDIT REPORT ------------------- */
router.patch("/:id", upload.array("files", 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => ({
        fileName: file.originalname,
        fileId: file.filename,
        fileType: file.mimetype,
      }));
      await Report.findByIdAndUpdate(req.params.id, {
        $push: { files: { $each: newFiles } },
      });
    }

    const updated = await Report.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ success: true, report: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------- ADMIN: ADD FILES TO EXISTING REPORT ------------------- */
router.put("/:id/add-files", upload.array("files", 10), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const newFiles = req.files.map((file) => ({
      fileName: file.originalname,
      fileId: file.filename,
      fileType: file.mimetype,
    }));

    report.files.push(...newFiles);
    await report.save();

    res.status(200).json({ success: true, files: report.files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
