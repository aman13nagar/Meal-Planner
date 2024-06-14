// routes/nutrition.js
const express = require('express');
const router = express.Router();
const { getNutritionData, getNutritionByRecipeId } = require('../controllers/nutritionControlloer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:recipeId', authMiddleware, getNutritionData);
router.get('/:recipeId', authMiddleware, getNutritionByRecipeId);

module.exports = router;
