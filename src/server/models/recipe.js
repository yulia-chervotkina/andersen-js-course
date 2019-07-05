import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ingredients: {
    type: String,
  },
  instruction: {
    type: String,
  },
  favorite: {
    type: Boolean,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
