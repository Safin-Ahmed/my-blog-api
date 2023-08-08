const authenticate = (req, _res, next) => {
  req.user = {
    id: "64d1ff1d50185a693e2b97e6",
    name: "Safin Ahmed",
    email: "safin@gmail.com",
    password: "SafinAhmed",
    role: "user",
  };
  next();
};

module.exports = authenticate;
