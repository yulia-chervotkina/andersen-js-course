const express = require('express');
const connectDB = require('./db');
const router = require('./routers');

connectDB();

const app = express();

app.use(express.json());
app.use(express.static('src'));
app.use('/api/recipes', router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
