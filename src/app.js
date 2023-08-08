const express = require("express");
("express-openapi-validator");
const User = require("./model/User");
const applyMiddleware = require("./middleware");
const routes = require("./routes");
// express app
const app = express();

applyMiddleware(app);

// Routes
app.use(routes);

app.get("/health", (req, res) => {
  res.status(200).json({
    health: "OK",
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  // console error
  console.log(err);

  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
