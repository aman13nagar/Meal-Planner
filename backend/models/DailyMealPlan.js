const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  meals: {
    breakfast: {
      type: String,
      required: true,
    },
    lunch: {
      type: String,
      required: true,
    },
    dinner: {
      type: String,
      required: true,
    },
  },
  nutritionalData: {
    breakfast: {
      calories: String,
      protein: String,
      fat: String,
      carbs: String,
    },
    lunch: {
      calories: String,
      protein: String,
      fat: String,
      carbs: String,
    },
    dinner: {
      calories: String,
      protein: String,
      fat: String,
      carbs: String,
    },
  },
});

const DailyMealPlan = mongoose.model('DailyMealPlan', MealPlanSchema);
module.exports = DailyMealPlan;

