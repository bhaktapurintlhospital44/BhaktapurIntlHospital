const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get a specific FAQ by ID
router.get('/:id', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

// Create a new FAQ
router.post('/', async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    
    const newFaq = new Faq({
      question,
      answer,
      order: order || 0
    });
    
    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

// Update a FAQ
router.put('/:id', async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, order },
      { new: true, runValidators: true }
    );
    
    if (!updatedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json(updatedFaq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete a FAQ
router.delete('/:id', async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    
    if (!deletedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router;