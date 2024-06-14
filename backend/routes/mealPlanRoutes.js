const express = require('express');
const { getMealPlans, createMealPlan, updateMealPlan, deleteMealPlan } = require('../controllers/mealPlanController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const axios =require('axios');
const { check, validationResult } = require('express-validator');
const DailyMealPlan = require('../models/DailyMealPlan');
const Recipe = require('../models/Recipe');

router.get('/', authMiddleware, getMealPlans);
router.post('/', authMiddleware, createMealPlan);
router.put('/:id', authMiddleware, updateMealPlan);
router.delete('/:id', authMiddleware, deleteMealPlan);

router.get('/daily-meals', authMiddleware, async (req, res) => {
  try {
    const mealPlans = await DailyMealPlan.find({ user: req.user.id });
    res.json(mealPlans);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create or update meal plan for a specific date
router.post('/daily-meals', authMiddleware, async (req, res) => {
  const { date, meals,nutritionalData } = req.body;
  const userId = req.user.id;
  console.log(date,nutritionalData,meals,userId);

  try {
    let mealPlan = await DailyMealPlan.findOne({ user: userId, date:date });
    if (mealPlan) {
      mealPlan.date=date;
      mealPlan.meals = meals;
      mealPlan.nutritionalData=nutritionalData;
      await mealPlan.save();
    } else {
      mealPlan = new DailyMealPlan({ user: userId, date:date, meals,nutritionalData:nutritionalData});
      await mealPlan.save();
    }
    res.json(mealPlan);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update meal plan
router.put('/daily-meals/:id', authMiddleware, async (req, res) => {
  const { meals } = req.body;
  console.log(meals,req.params.id);
  try {
    let mealPlan = await DailyMealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ msg: 'Meal plan not found' });

    if (mealPlan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    mealPlan.meals = meals;
    await mealPlan.save();
    res.json(mealPlan);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
router.post('/nutrition-info', authMiddleware, async (req, res) => {
  try {
    const { meal } = req.body;
    console.log(meal);

    const apiKey = 'a8f98c4b503140fe96ae8b20c4c0a10e';
    const apiResponse = await axios.get(`https://api.spoonacular.com/recipes/guessNutrition?title=${meal}`, {
      params: { apiKey }
    });
    const data=apiResponse.data;
    console.log(data);
    if (!data || data.length === 0) {
      return res.status(404).json({ msg: 'No nutritional information found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/generate', async (req, res) => {
  try {
    const apiKey = 'a8f98c4b503140fe96ae8b20c4c0a10e';
    const apiResponse = await axios.get('https://api.spoonacular.com/mealplanner/generate?timeFrame=day', {
      params: { apiKey }
    });
    const generatedMealPlan = apiResponse.data;
    res.json(generatedMealPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating meal plan' });
  }
});

router.get('/weekly', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const weeklyMealPlans = await DailyMealPlan.find({
      user: userId,
      date: { $gte: oneWeekAgo },
    }).sort({ date: 1 });

    res.json(weeklyMealPlans);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
module.exports = router;
