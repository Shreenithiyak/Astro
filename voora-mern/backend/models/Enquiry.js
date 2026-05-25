const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[+]?[\d\s\-()]{7,15}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  interestedProject: {
    type: String,
    required: [true, 'Please select a project'],
    enum: [
      'Voora One Sea — ECR (₹7,199/sqft)',
      'Voora Westside — Ramapuram (From ₹1 Cr)',
      'Voora Agastya — Tondiarpet (From ₹2.3 Cr)',
      'Voora Beckford — Nungambakkam',
      'Voora Highway Haven — Kanchipuram Plots',
      'Other / Not sure'
    ]
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Site Visit Scheduled', 'Converted', 'Not Interested'],
    default: 'New'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
