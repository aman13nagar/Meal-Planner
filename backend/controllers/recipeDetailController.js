
const RecipeDatail = require('../models/RecipeDetail');
const axios = require('axios');
const fetchRecipes = async () => {
    try {
      const apiKey = '49d9b371ba6c4cc98257869758c69605'; // Access the API key from environment variables
      const res = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: apiKey,
          number: 100, // Number of recipes to fetch
          diet: 'vegetarian', // Example dietary restriction, can be dynamic
          addRecipeInformation: true,
        },
      });
      setRecipes(res.data.results);
      saveToLocalStorage('recipes', res.data.results);
      setError('');
    } catch (err) {
      setError('Error fetching recipes');
      console.error(err);
    }
};
const getRecipes = async (req, res) => {
  try {
    const recipes = await RecipeDatail.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await RecipeDatail.findOne({ id: req.params.id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRecipe = await RecipeDatail.findOne({ id });

    if (existingRecipe) return res.status(201).json(existingRecipe);

    const apiKey = '49d9b371ba6c4cc98257869758c69605';
    const apiResponse = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: { apiKey }
    });
    const newRecipe = new RecipeDatail(apiResponse.data);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
};
