// src/components/Articles/ArticleCard.tsx
import React from "react";
import type{ Article } from "./Types";

interface Props {
  article: Article;
}

const ArticleCard: React.FC<Props> = ({ article }) => (
  <div key={article.id}>
    <h2>{article.title}</h2>
    <p>{JSON.stringify(article.content)}</p>
    <small>{new Date(article.createdAt).toLocaleString()}</small>
  </div>
);

export default ArticleCard;
