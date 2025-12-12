const axios = require("axios");

async function fetchArticlesFromStrapi() {
  try {
    const response = await axios.get("http://localhost:1337/api/articles?populate=*");
    const articles = response.data.data.map(item => ({
      strapiId: item.id,
      documentId: item.documentId,
      title: item.title,
      content: item.content.map(c => c.children.map(ch => ch.text).join(" ")).join("\n"),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      image: item.image.map(img => img.url).join(",") // store as comma-separated string
    }));
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }
}

module.exports = { fetchArticlesFromStrapi };
