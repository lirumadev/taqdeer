const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  arabic: String,
  translation: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  grade: String
});

const ScholarOpinionSchema = new mongoose.Schema({
  scholar: {
    type: String,
    required: true
  },
  opinion: {
    type: String,
    required: true
  }
});

const RulingSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  evidences: [EvidenceSchema],
  scholarOpinions: [ScholarOpinionSchema],
  notes: String,
  references: [String],
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  searchCount: {
    type: Number,
    default: 1
  },
  tags: [String],
  category: {
    type: String,
    enum: [
      'Prayer',
      'Fasting',
      'Zakat',
      'Hajj',
      'Family',
      'Business',
      'Social',
      'Personal',
      'Other'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
});

// Index for text search
RulingSchema.index({ 
  query: 'text', 
  title: 'text', 
  summary: 'text' 
});

// Method to find similar rulings
RulingSchema.statics.findSimilar = async function(query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(1);
};

// Method to update search statistics
RulingSchema.statics.updateSearchStats = async function(rulingId) {
  return this.findByIdAndUpdate(rulingId, {
    $inc: { searchCount: 1 },
    lastSearched: new Date()
  });
};

module.exports = mongoose.model('Ruling', RulingSchema); 