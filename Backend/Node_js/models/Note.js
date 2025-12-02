const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Note = sequelize.define("Note", {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  notes_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  canvas_image: {
    type: DataTypes.TEXT, // store base64 string or URL
    allowNull: true,
  },
}, {
  tableName: "Notes",
  timestamps: true, // adds createdAt & updatedAt
});

module.exports = Note;
