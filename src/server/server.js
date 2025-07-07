import express from 'express';
import router from './routers.js';
import connectDB from './db.js';

connectDB();

const app = express();

app.use(express.json());
app.use(express.static('client'));
app.use('/', router);
app.use('/favorites', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
