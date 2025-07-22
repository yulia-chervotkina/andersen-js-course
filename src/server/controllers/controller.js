const Recipe = require('../models/Recipe');

const createRecipe = async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const savedRecipe = await recipe.save();
    // console.log('recipe created successfully');
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const getRecipeByID = async (req, res) => {
//   try {
//     const recipe = await Recipe.findOne(req.body.id);
//     res.status(201).json(recipe);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

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
    const favRecipies = await Recipe.find({
      isFavorite: true,
    });
    res.status(200).json(favRecipies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Recipe.findOneAndDelete({ _id: id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getRecipies,
  getFavoriteRecipies,
  updateRecipe,
  deleteRecipe,
};
