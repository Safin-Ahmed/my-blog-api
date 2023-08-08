const fs = require("fs/promises");
const path = require("path");

class DatabaseConnection {
  constructor(dbURL) {
    this.db = null;
    this.dbURL = path.resolve(...dbURL.split("/"));
  }

  async connect() {
    const dbStr = await fs.readFile(this.dbURL, { encoding: "utf-8" });
    this.db = JSON.parse(dbStr);
  }

  async write() {
    if (this.db) {
      await fs.writeFile(this.dbURL, JSON.stringify(this.db));
      return;
    }
  }

  async getDB() {
    if (this.db) {
      return this.db;
    }

    await this.connect();
    return this.db;
  }
}

const databaseConnection = new DatabaseConnection(process.env.DB_URL);

module.exports = databaseConnection;
