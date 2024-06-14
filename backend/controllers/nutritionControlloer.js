const axios = require('axios');
const Nutrition = require('../models/Nutrition');
const RecipeDatail=require('../models/RecipeDetail');

const getNutritionData = async (req, res) => {
  const { recipeId } = req.params;
  const nutrition = await Nutrition.findOne({recipeId});
  const recipe=await RecipeDatail.findOne({id:recipeId});
  if(nutrition) return res.status(200).json(nutrition);
  const API_KEY = '278cdb80320e44858c70bf1d85db3147';
  const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const nutritionInfo = response.data;
    const newNutrition = new Nutrition({
      recipeId:recipeId,
      calories: nutritionInfo.calories,
      carbs: nutritionInfo.carbs,
      fat: nutritionInfo.fat,
      protein: nutritionInfo.protein,
      bad: nutritionInfo.bad,
      good: nutritionInfo.good,
      nutrients: nutritionInfo.nutrients,
      properties: nutritionInfo.properties,
      flavonoids: nutritionInfo.flavonoids
    });
    await newNutrition.save();
    res.json(newNutrition);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    res.status(500).send('Server error');
  }
};

const getNutritionByRecipeId = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const nutrition = await Nutrition.findOne({ recipeId });
    if (!nutrition) {
      return res.status(404).json({ msg: 'Nutrition data not found' });
    }
    res.json(nutrition);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getNutritionData,
  getNutritionByRecipeId,
};
