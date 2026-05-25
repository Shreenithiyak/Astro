const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Luxury', 'Apartments', 'Plots', 'Villas', 'Commercial']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming'],
    default: 'Ongoing'
  },
  bhkOptions: [{
    type: String
  }],
  rera: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
