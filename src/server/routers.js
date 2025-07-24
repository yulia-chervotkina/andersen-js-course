const express = require('express');
const recipeBook = require('./controllers/controller');

const router = express.Router();

router.get('/', recipeBook.getRecipies);
router.get('/favorite', recipeBook.getFavoriteRecipies);
router.get('/:id', recipeBook.getRecipeByID);

router.post('/', recipeBook.createRecipe);
router.put('/:id', recipeBook.updateRecipe);
router.patch('/:id', recipeBook.addRecipeToFavorite);
router.delete('/:id', recipeBook.deleteRecipe);

module.exports = router;
