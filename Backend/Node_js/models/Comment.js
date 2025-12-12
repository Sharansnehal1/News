const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const comments = sequelize.define("Comment", {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
   Name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
   userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // table name of User model
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
}, {
  tableName: "Comment",
  timestamps: true, // adds createdAt & updatedAt
});


 comments.associate = (models) => {
    comments.belongsTo(models.User, { foreignKey: "userId" });
    comments.belongsTo(models.News, { foreignKey: "newsId" });
  };
module.exports = comments;
