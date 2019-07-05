import express from 'express';

const router = express.Router();

router
  .route('')
  .get(async (req, res) => {
    const recipes = await req.context.models.Recipe.find();
    return res.json(recipes);
  })
  .post(async (req, res) => {
    const recipe = new req.context.models.Recipe(req.body);
    const message = await recipe.save();
    return res.json({ message });
  });

router
  .route('/:id')
  .patch(async (req, res) => {
    const message = await req.context.models.Recipe.findByIdAndUpdate(req.params.id, req.body);
    return res.json(message);
  })
  .delete(async (req, res) => {
    const message = await req.context.models.Recipe.findByIdAndDelete(req.params.id);
    return res.json(message);
  });

module.exports = router;
