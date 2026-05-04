const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ order: 1, createdAt: 1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get a specific story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Create a new story
router.post('/', async (req, res) => {
  try {
    const { title, patient, summary, content, order, image } = req.body;
    
    const newStory = new Story({
      title,
      patient,
      summary,
      content,
      order,
      image
    });
    
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Update a story
router.put('/:id', async (req, res) => {
  try {
    const { title, patient, summary, content, order, image } = req.body;
    
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { title, patient, summary, content, order, image },
      { new: true, runValidators: true }
    );
    
    if (!updatedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    
    if (!deletedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

module.exports = router;