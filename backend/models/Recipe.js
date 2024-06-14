const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  instructions: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
  },
  image: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Recipe= mongoose.model('Recipe', RecipeSchema);
module.exports=Recipe;


