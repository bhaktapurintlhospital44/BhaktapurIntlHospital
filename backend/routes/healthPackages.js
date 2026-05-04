const express = require('express');
const router = express.Router();
const HealthPackage = require('../models/HealthPackage');

// Get all health packages
router.get('/', async (req, res) => {
  try {
    const packages = await HealthPackage.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    console.error('Error fetching health packages:', error);
    res.status(500).json({ error: 'Failed to fetch health packages' });
  }
});

// Get a specific health package by ID
router.get('/:id', async (req, res) => {
  try {
    const package = await HealthPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Health package not found' });
    }
    res.json(package);
  } catch (error) {
    console.error('Error fetching health package:', error);
    res.status(500).json({ error: 'Failed to fetch health package' });
  }
});

// Create a new health package
router.post('/', async (req, res) => {
  try {
    const { name, description, price, features } = req.body;
    
    const newPackage = new HealthPackage({
      name,
      description,
      price,
      features
    });
    
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error('Error creating health package:', error);
    res.status(500).json({ error: 'Failed to create health package' });
  }
});

// Update a health package
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, features } = req.body;
    
    const updatedPackage = await HealthPackage.findByIdAndUpdate(
      req.params.id,
      { name, description, price, features },
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return res.status(404).json({ error: 'Health package not found' });
    }
    
    res.json(updatedPackage);
  } catch (error) {
    console.error('Error updating health package:', error);
    res.status(500).json({ error: 'Failed to update health package' });
  }
});

// Delete a health package
router.delete('/:id', async (req, res) => {
  try {
    const deletedPackage = await HealthPackage.findByIdAndDelete(req.params.id);
    
    if (!deletedPackage) {
      return res.status(404).json({ error: 'Health package not found' });
    }
    
    res.json({ message: 'Health package deleted successfully' });
  } catch (error) {
    console.error('Error deleting health package:', error);
    res.status(500).json({ error: 'Failed to delete health package' });
  }
});

module.exports = router;