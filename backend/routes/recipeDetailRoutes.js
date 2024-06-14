const express = require('express');
const { getRecipes, getRecipeById, addRecipe } = require('../controllers/recipeDetailController');
const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware')

router.get('/',authMiddleware, getRecipes);
router.get('/:id',authMiddleware, getRecipeById);
router.post('/:id',authMiddleware, addRecipe);

module.exports = router;
