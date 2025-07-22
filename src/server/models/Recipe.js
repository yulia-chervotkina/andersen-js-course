const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipe = new Schema({
  name: { type: String },
  ingredients: { type: String },
  instructions: { type: String },
  isFavorite: { type: Boolean, default: false },
});

const Recipe = mongoose.model('Recipe', recipe);

module.exports = Recipe;
