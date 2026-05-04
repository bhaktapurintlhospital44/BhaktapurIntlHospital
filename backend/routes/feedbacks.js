const express = require('express');
const router = express.Router();
const FeedBack = require('../models/FeedBack');
// ✅ ADDED THIS IMPORT: Check your path to ensure it's correct
// const { sendFeedBack } = require('../services/emailService'); 

// Submit a new FeedBack
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newFeedBack = new FeedBack({
      name,
      email,
      subject,
      message
    });
    
    const savedFeedBack = await newFeedBack.save();
    
    // ✅ This will now work because sendFeedBack is imported
    // try {
    //   // await sendFeedBack(savedFeedBack);  
    // } catch (emailError) {
    //   // We log the email error but don't stop the request 
    //   // so the user still gets a "Success" message on the frontend
    //   console.error('Email notification failed:', emailError);
    // }
    
    res.status(201).json(savedFeedBack);
  } catch (error) {
    console.error('Error submitting FeedBack:', error);
    res.status(500).json({ error: 'Failed to submit FeedBack' });
  }
});

// Get all feedbacks (for admin panel)
router.get('/', async (req, res) => {
  try {
    const feedback = await FeedBack.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching FeedBack:', error);
    res.status(500).json({ error: 'Failed to fetch FeedBack' });
  }
}); 

// Get a specific Feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback); // Fixed: was 'question'
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
}); 

// Delete a feedback
router.delete('/:id', async (req, res) => {
  try {
    const deletedFeedBack = await FeedBack.findByIdAndDelete(req.params.id);
    
    if (!deletedFeedBack) {
      return res.status(404).json({ error: 'FeedBack not found' });
    }
    
    res.json({ message: 'FeedBack deleted successfully' });
  } catch (error) {
    console.error('Error deleting FeedBack:', error);
    res.status(500).json({ error: 'Failed to delete FeedBack' });
  }
});

module.exports = router;