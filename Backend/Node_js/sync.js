const sequelize = require("./db");
const Note = require("./models/Note");

(async () => {
  try {
    await sequelize.sync({ alter: true });//sequelize.sync() creates the table in the database if it doesn’t already exist.
    console.log("All tables synced successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
