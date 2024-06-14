const Recipe = require('../models/Recipe');

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    console.log(req.user.id);
    const recipes = await Recipe.find({user:req.user.id});
    res.json(recipes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Create a new recipe
const createRecipe = async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      user: req.user.id
    });
    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;

    recipe = await Recipe.findByIdAndUpdate(req.params.id, recipe, { new: true });
    res.json(recipe);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    await Recipe.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};


