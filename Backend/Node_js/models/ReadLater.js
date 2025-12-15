const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const ReadLater = sequelize.define("ReadLater", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "read_later",
  timestamps: false,
  uniqueKeys: {
    unique_user_article: {
      fields: ["user_id", "article_id"]
    }
  }
});

User.hasMany(ReadLater, { foreignKey: "user_id" });
ReadLater.belongsTo(User, { foreignKey: "user_id" });

module.exports = ReadLater;
