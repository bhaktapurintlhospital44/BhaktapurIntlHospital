const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  // This array allows the "plus button" functionality.
  // You can push new objects into this array whenever the admin adds a file.
  files: [
    {
      fileName: { type: String, required: true },
      fileId: { type: String, required: true },
      fileType: { type: String, required: true }, // e.g., 'image/jpeg', 'video/mp4', 'application/pdf'
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  // If these are meant to control the WHOLE Reports section in the nav,
  // we should consider if these belong here or in a GlobalSettings model.
  // If they stay here, usually only the "latest" report's settings would apply.
  showInSection: { type: Boolean, default: false },
  navLabel: { type: String, default: "Reports" },

  createdBy: { type: String, default: "Hospital Administration" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
