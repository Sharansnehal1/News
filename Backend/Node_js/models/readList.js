const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const ReadList = sequelize.define("ReadList", {
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
    onDelete: "CASCADE",  // delete readlist when user is deleted
    onUpdate: "CASCADE"
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "read_list",
  timestamps: true,
  uniqueKeys: {
    unique_user_article: {
      fields: ["user_id", "article_id"]
    }
  }
});

// Association (optional but recommended)
User.hasMany(ReadList, { foreignKey: "user_id" });
ReadList.belongsTo(User, { foreignKey: "user_id" });

module.exports = ReadList;
