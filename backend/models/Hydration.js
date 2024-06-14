// models/Hydration.js
const mongoose = require('mongoose');

const HydrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required:true,
    default: Date.now,
  },
});

const Hydration= mongoose.model('Hydration', HydrationSchema);
module.exports=Hydration;
