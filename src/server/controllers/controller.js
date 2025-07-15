const Recipe = require('../models/Recipe');

const createRecipe = async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRecipies = async (req, res) => {
  try {
    const recipies = await Recipe.find();
    res.status(200).json(recipies);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getFavoriteRecipies = async (req, res) => {
  try {
    const favRecipies = await Recipe.find({ favorite: true });
    res.status(200).json(favRecipies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.updateOne();
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// TO-DO GET AN ID
const deleteRecipe = async (req, res) => {
  try {
    await Recipe.deleteOne();
    res.status(204).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.export = { createRecipe, getRecipies, getFavoriteRecipies, updateRecipe, deleteRecipe };
