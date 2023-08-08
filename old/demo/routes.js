const router = require("express").Router();
const { demoControllers } = require("./controller");

const myMiddleware = (req, res, next) => {
  next();
};
router.get("/path", myMiddleware, demoControllers);

module.exports = router;
