const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: String,
  image: String,
  readyInMinutes: Number,
  servings: Number,
  extendedIngredients: Array,
  instructions: String,
});

const RecipeDetail = mongoose.model('RecipeDetail', recipeSchema);

module.exports = RecipeDetail;
