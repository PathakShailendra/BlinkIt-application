const express = require('express');
const app = express();
const indexRouter = require('./routes');
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
