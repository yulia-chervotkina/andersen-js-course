const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipe = new Schema({
  name: String,
  ingredients: String,
  instructions: String,
  isFavorite: Boolean,
});

const Recipe = mongoose.model('Recipe', recipe);

module.exports = Recipe;
