const authenticate = (req, _res, next) => {
  req.user = {
    id: "64cf4dec43481c6ddc38e5a6",
    name: "Safin Ahmed",
    email: "safin@gmail.com",
    password: "123456",
    role: "user",
  };
  next();
};

module.exports = authenticate;
