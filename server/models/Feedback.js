const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  feedbackType: {
    type: String,
    required: true,
    enum: ['incorrect_translation', 'incorrect_arabic', 'incorrect_reference', 'irrelevant_dua', 'other']
  },
  comment: {
    type: String,
    required: true
  },
  duaData: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'reviewed', 'resolved', 'rejected']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema); 