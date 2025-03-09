const mongoose = require('mongoose');

const DuaSchema = new mongoose.Schema({
  arabic: {
    type: String,
    required: true
  },
  transliteration: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dua', DuaSchema); 