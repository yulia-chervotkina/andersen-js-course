const express = require('express');
const recipeBook = require('./controllers/controller');

const router = express.Router();

router.get('/', recipeBook.getRecipies); // main page
// router.get('/', recipeBook.getRecipeByID);
router.get('/favorite', recipeBook.getFavoriteRecipies); // fav recipies
router.post('/', recipeBook.createRecipe); // post a new recipe
router.patch('/:id', recipeBook.updateRecipe); // update a recipe
router.delete('/:id', recipeBook.deleteRecipe); // delete a recipe

module.exports = router;
