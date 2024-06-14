const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id }).populate('recipes', 'title');
    res.json(mealPlans);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const createMealPlan = async (req, res) => {
  const { name, recipes } = req.body;
  try {
    const newMealPlan = new MealPlan({
      name,
      recipes,
      user: req.user.id,
    });
    const mealPlan = await newMealPlan.save();
    res.json(mealPlan);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
const updateMealPlan = async (req, res) => {
  const { name, recipes } = req.body;
  try {
    let mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) return res.status(404).json({ msg: 'Meal plan not found' });

    // Ensure user owns the meal plan
    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      { $set: { name, recipes } },
      { new: true }
    );

    res.json(mealPlan);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
const deleteMealPlan = async (req, res) => {
  try {
    let mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) return res.status(404).json({ msg: 'Meal plan not found' });

    // Ensure user owns the meal plan
    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await MealPlan.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Meal plan removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
