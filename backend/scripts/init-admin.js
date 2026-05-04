// Script to create initial admin user
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username: 'sahil' });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
        process.exit(0);
      }
      
      // Create new admin user
      const admin = new Admin({
        username: 'sahil',
        password: 'sahil123' // In a real app, you should use a stronger password
      });
      
      await admin.save();
      console.log('Admin user created successfully');
      console.log('Username: sahil');
      console.log('Password: sahil123');
      console.log('Please change the password after first login for security');
      
      process.exit(0);
    } catch (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });