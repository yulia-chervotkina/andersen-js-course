import express from 'express';

const router = express.Router();

router.route('').get(async (req, res) => {
  const favorites = await req.context.models.Recipe.find({ favorite: true });
  return res.json(favorites);
});

module.exports = router;
