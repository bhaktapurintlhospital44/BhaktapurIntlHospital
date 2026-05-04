const mongoose = require("mongoose");

//for allowing to add multiple doctors with images, we define a sub-schema for doctor
const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String } // Stores the URL path
});

//for department details
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  imageIcon: {type: String},
  contactNumber: { type: String },
  email: { type: String },
  // Changed from doctor: String to doctors: [DoctorSchema]
  doctors: [DoctorSchema], 
  facilities: [String],
  services: [String],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
