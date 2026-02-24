const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});