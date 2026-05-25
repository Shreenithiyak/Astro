const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// CREATE - Submit new enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, email, interestedProject, message } = req.body;

    if (!fullName || !phone || !email || !interestedProject) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    const enquiry = new Enquiry({ fullName, phone, email, interestedProject, message });
    const saved = await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our team will contact you soon.',
      data: saved
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// READ ALL - Get all enquiries with filters (admin)
router.get('/', async (req, res) => {
  try {
    const { status, project, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (project) query.interestedProject = { $regex: project, $options: 'i' };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// STATS - Dashboard stats
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: 'New' });
    const converted = await Enquiry.countDocuments({ status: 'Converted' });
    const siteVisit = await Enquiry.countDocuments({ status: 'Site Visit Scheduled' });

    const byProject = await Enquiry.aggregate([
      { $group: { _id: '$interestedProject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { total, new: newCount, converted, siteVisit, byProject }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// READ ONE - Get single enquiry
router.get('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE - Update enquiry status/notes
router.put('/:id', async (req, res) => {
  try {
    const { status, notes, fullName, phone, email, interestedProject, message } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (interestedProject) updateData.interestedProject = interestedProject;
    if (message !== undefined) updateData.message = message;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Enquiry updated successfully', data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE - Delete enquiry
router.delete('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
