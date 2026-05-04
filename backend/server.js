const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Disposition"], // This allows the frontend to see the filename for downloads
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ STATIC FILES CONFIGURATION
// These lines allow the browser to access your local folders via URL
app.use("/images", express.static(path.join(__dirname, "public/images")));

// New route for Reports (Filesystem approach)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    setHeaders: (res, filePath) => {
      // This allows the browser to DECIDE.
      // If it can open it (PDF/JPG), it will.
      // If it can't (DOCX/HEIC), it will download.
      res.setHeader("Content-Disposition", "inline");
    },
  }),
);

app.use(
  "/videos",
  express.static(path.join(__dirname, "../frontend/public/videos")),
);

// Import Routes
const homeContentRoutes = require("./routes/homeContent");
const adminRoutes = require("./routes/admin");
const aboutContentRoutes = require("./routes/aboutContent");
const healthPackagesRoutes = require("./routes/healthPackages");
const bookingsRoutes = require("./routes/bookings");
const appointmentsRoutes = require("./routes/appointments");
const questionsRoutes = require("./routes/questions");
const faqsRoutes = require("./routes/faqs");
const storiesRoutes = require("./routes/stories");
const departmentsRoutes = require("./routes/departments");
const feedbacksRoutes = require("./routes/feedbacks");
const reportsRoutes = require("./routes/reports");

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hospital")
  .then(() => console.log("MongoDB connected (Filesystem Mode)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/home-content", homeContentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/about-content", aboutContentRoutes);
app.use("/api/health-packages", healthPackagesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/faqs", faqsRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/reports", reportsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hospital Backend API Running...");
});

// Route to serve patient reports securely
app.get("/api/reports/view/:filename", (req, res) => {
  // This logic ensures we find the file regardless of which folder it's in
  const publicPath = path.join(
    __dirname,
    "public",
    "uploads",
    req.params.filename,
  );
  const rootPath = path.join(__dirname, "uploads", req.params.filename);

  // Set the header to allow viewing
  res.setHeader("Content-Disposition", "inline");

  // Check public/uploads first, then root uploads
  const fs = require("fs");
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  } else if (fs.existsSync(rootPath)) {
    return res.sendFile(rootPath);
  } else {
    console.error("File not found at:", publicPath, "or", rootPath);
    return res.status(404).send("Report file not found on server.");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files available at http://localhost:${PORT}/uploads/`);
});
