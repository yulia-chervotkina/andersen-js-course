import express from 'express';

const router = express.Router();

// main page
router.get('/', (req, res) => {
  res.send('TO-DO');
});

// fav recipies
router.get('/favorites', (req, res) => {
  res.send('TO-DO');
});

// post a new recipe
router.post('/', (req, res) => {
  res.send('TO-DO');
});

// delete a recipe
router.delete('/:recipeID', (req, res) => {
  res.send('TO-DO');
});

export default router;
