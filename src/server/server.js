const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const router = require('./routers');

connectDB();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  })
);
app.use(express.json());
app.use(express.static('src'));
app.use('/api/recipes', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
