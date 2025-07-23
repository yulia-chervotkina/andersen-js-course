const express = require('express');
const recipeBook = require('./controllers/controller');

const router = express.Router();

router.get('/', recipeBook.getRecipies); // main page
router.get('/favorite', recipeBook.getFavoriteRecipies); // fav recipies
router.get('/:id', recipeBook.getRecipeByID); // get a specific recipe

router.post('/', recipeBook.createRecipe); // post a new recipe
router.put('/:id', recipeBook.updateRecipe); // update a recipe
router.patch('/:id', recipeBook.addRecipeToFavorite); // add a recipe to fav
router.delete('/:id', recipeBook.deleteRecipe); // delete a recipe

module.exports = router;
