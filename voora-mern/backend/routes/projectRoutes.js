const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// CREATE
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json({ success: true, message: 'Project created successfully', data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const { status, type, featured } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (featured) query.featured = featured === 'true';

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Seed default projects
router.post('/seed/defaults', async (req, res) => {
  try {
    const existing = await Project.countDocuments();
    if (existing > 0) {
      return res.json({ success: false, message: 'Projects already exist' });
    }

    const defaults = [
      {
        name: 'Voora One Sea',
        type: 'Luxury',
        location: 'ECR, Chennai',
        area: 'East Coast Road',
        price: '₹7,199/sqft',
        description: 'Sea-facing luxury apartments with breathtaking ocean views',
        tags: ['Sea View', 'IGBC Gold', 'Luxury'],
        status: 'Ongoing',
        bhkOptions: ['3 BHK', '4 BHK', 'Penthouse'],
        featured: true
      },
      {
        name: 'Voora Westside',
        type: 'Apartments',
        location: 'Ramapuram, Chennai',
        price: 'From ₹1 Cr',
        description: 'Zero dead space design with smart home integration',
        tags: ['Smart Home', 'Zero Dead Space', 'RERA'],
        status: 'Ongoing',
        bhkOptions: ['2 BHK', '3 BHK'],
        featured: true
      },
      {
        name: 'Voora Agastya',
        type: 'Luxury',
        location: 'Tondiarpet, Chennai',
        price: 'From ₹2.3 Cr',
        description: 'Sea-facing luxury residences in Tondiarpet',
        tags: ['Sea View', '3 & 4 BHK', 'Ongoing'],
        status: 'Ongoing',
        bhkOptions: ['3 BHK', '4 BHK'],
        featured: false
      },
      {
        name: 'Voora Highway Haven',
        type: 'Plots',
        location: 'Panapakkam, Kanchipuram',
        price: '₹1,500/sqft',
        description: 'DTCP approved gated community plots on NH48',
        tags: ['DTCP Approved', 'RERA', 'Gated Community'],
        status: 'Ongoing',
        featured: false
      }
    ];

    await Project.insertMany(defaults);
    res.json({ success: true, message: 'Default projects seeded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Seed failed' });
  }
});

module.exports = router;
