const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { sendQuestionNotification, sendQuestionResponse } = require('../utils/emailService');

// Submit a new question
router.post('/', async (req, res) => {
  try {
    const { name, email, question } = req.body;
    
    const newQuestion = new Question({
      name,
      email,
      question
    });
    
    const savedQuestion = await newQuestion.save();
    
    // Send notification email to admin
    await sendQuestionNotification(savedQuestion);
    
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Failed to submit question' });
  }
});

// Get all questions (for admin panel)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get a specific question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Update a question (for admin panel - to add answers)
router.put('/:id', async (req, res) => {
  try {
    const { answer, status } = req.body;
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { answer, status },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // If the question has been answered, send response email to user
    if (updatedQuestion.status === 'answered' && updatedQuestion.answer) {
      await sendQuestionResponse(updatedQuestion);
    }
    
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    
    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;