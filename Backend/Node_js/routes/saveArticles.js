const sequelize = require("../db");
const Article = require("../models/article");
const { fetchArticlesFromStrapi } = require("../services/strapi");

async function saveArticles() {
  try {
    await sequelize.sync(); // Ensure tables exist
    const articles = await fetchArticlesFromStrapi();

    for (const art of articles) {
      // Use upsert to avoid duplicates
      await Article.upsert(art);
    }

    console.log("Articles saved successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error saving articles:", err);
    process.exit(1);
  }
}

saveArticles();
