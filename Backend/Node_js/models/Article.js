const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Article = sequelize.define("Article", {
  strapiId: { type: DataTypes.INTEGER, unique: true },
  documentId: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  image: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
  publishedAt: { type: DataTypes.DATE },
});

module.exports = Article;
