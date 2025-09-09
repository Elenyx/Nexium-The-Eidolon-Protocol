'use strict';

// Simple Express web server starter
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from my-awesome-rpg web server');
});

app.listen(port, () => console.log(`[web] server running on http://localhost:${port}`));
