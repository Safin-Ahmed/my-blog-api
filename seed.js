const { faker } = require("@faker-js/faker");
const User = require("./src/model/User");

const seedUser = (n = 5) => {
  for (let i = 0; i < n; i++) {
    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    user.save();
  }
};

module.exports = { seedUser };
