// Script to update admin user credentials
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Find existing admin user
      const existingAdmin = await Admin.findOne({ username: 'admin' });
      
      if (!existingAdmin) {
        console.log('Admin user with username "admin" not found');
        process.exit(1);
      }
      
      // Update admin credentials
      existingAdmin.username = 'sahil';
      existingAdmin.password = 'sahil123';
      
      await existingAdmin.save();
      console.log('Admin user updated successfully');
      console.log('New Username: sahil');
      console.log('New Password: sahil123');
      console.log('Please change the password after first login for security');
      
      process.exit(0);
    } catch (error) {
      console.error('Error updating admin user:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });