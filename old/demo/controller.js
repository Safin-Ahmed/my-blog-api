const demoService = require("./service");

const demoController = (req, res) => {
  // parse the request
  // process the request
  demoService();
  // generate response
  res.send();
};

module.exports = { demoController };
