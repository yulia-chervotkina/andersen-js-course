import mongoose from 'mongoose';

const { Schema } = mongoose;

const recipe = new Schema({
  name: String,
  ingredients: String,
  instructions: String,
  favorite: Boolean
});

const Recipe = mongoose.model('Recipe', recipe);

export default Recipe;
