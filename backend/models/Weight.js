// models/Weight.js
const mongoose = require('mongoose');

const WeightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required:true,
    default: Date.now
  }
});

const Weight= mongoose.model('Weight', WeightSchema);
module.exports=Weight;
