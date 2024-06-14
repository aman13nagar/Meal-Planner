const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const MealPlan= mongoose.model('MealPlan', MealPlanSchema);
module.exports=MealPlan;

