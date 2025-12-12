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
  articleId: {

    type: DataTypes.INTEGER,
    allowNull: false, // every note must belong to an article
    references:{
      model: "Articles",
       key: "strapiId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE", // table name of Article model
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
  },
}, {
  tableName: "Notes",
  timestamps: true, // adds createdAt & updatedAt
});


 Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: "userId" });
    Note.belongsTo(Article, { foreignKey: "articleId" });
  };
module.exports = Note;
