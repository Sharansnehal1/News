const { Sequelize } = require("sequelize");// best way to connect to Postgres DB

const sequelize = new Sequelize("News", "postgres", "Snehal12", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // set true if you want to see SQL queries
});//DB name, username, password, config object

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Unable to connect to DB:", err);
  }
})();

module.exports = sequelize;
