import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PORT } from './config';
import recipeRoutes from './routes/recipes';
import favoriteRoutes from './routes/favorites';
import models, { connectDb } from './models';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// прокидываем models в request\response цикл

app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

app.use('/recipes', recipeRoutes);
app.use('/favorites', favoriteRoutes);

// очистка бд, использовалась в процессе разработки, решил оставить.

const eraseDatabaseOnSync = false;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await models.Recipe.deleteMany({});
  }
  app.listen(PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`The server has started on port ${PORT}. Now, you ready to start client!`)
  );
});
