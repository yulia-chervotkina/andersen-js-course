const express = require('express');
const recipeBook = require('./controllers/controller');

const router = express.Router();

router.get('/', recipeBook.getRecipies); // main page
router.get('/', recipeBook.getFavoriteRecipies); // fav recipies
router.post('/', recipeBook.createRecipe); // post a new recipe
router.patch('/', recipeBook.updateRecipe); // update a recipe
router.delete('/', recipeBook.deleteRecipe); // delete a recipe

module.exports = router;
