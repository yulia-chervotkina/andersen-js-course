import express from 'express';
import router from './routers.js';
import connectDB from './db.js';

connectDB();

const app = express();

app.use(express.json());
app.use(express.static('src'));
app.use('/', router);
app.use('/favorites', router);

const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
