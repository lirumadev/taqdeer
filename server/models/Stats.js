const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  uniqueVisitors: {
    type: Number,
    default: 0 // Starting with zero
  },
  duasGenerated: {
    type: Number,
    default: 0 // Starting with zero
  },
  duasShared: {
    type: Number,
    default: 0 // Starting with zero
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a singleton model - there will only ever be one document
StatsSchema.statics.getSingletonStats = async function() {
  const stats = await this.findOne();
  if (stats) {
    return stats;
  } else {
    return await this.create({});
  }
};

// Increment methods
StatsSchema.statics.incrementVisitors = async function() {
  const stats = await this.getSingletonStats();
  stats.uniqueVisitors += 1;
  stats.lastUpdated = Date.now();
  return await stats.save();
};

StatsSchema.statics.incrementDuasGenerated = async function() {
  const stats = await this.getSingletonStats();
  stats.duasGenerated += 1;
  stats.lastUpdated = Date.now();
  return await stats.save();
};

StatsSchema.statics.incrementDuasShared = async function() {
  const stats = await this.getSingletonStats();
  stats.duasShared += 1;
  stats.lastUpdated = Date.now();
  return await stats.save();
};

module.exports = mongoose.model('Stats', StatsSchema); 