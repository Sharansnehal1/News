import React, { useEffect, useState } from "react";
import type { Article } from "./types";

const ArticleDetails = () => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/article-contents?populate=*")
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.data[0]);
      })
      .catch((err) => console.error(err));

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!article) return <p>Loading...</p>;

  const imgUrl =
    article.image?.[0]?.url
      ? `http://localhost:1337${article.image[0].url}`
      : null;

  const readPage = () => {
    const text = `${article.title}. ${article.description}`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div
      className="container"
      style={{
        position: "relative",
        maxWidth: "900px",
        paddingTop: "40px",
        paddingBottom: "60px",
        fontFamily: "Inter, sans-serif",
        lineHeight: "1.8",
      }}
    >
      {/* LEFT STICKY SOCIAL BAR */}
      <div
        style={{
          position: "fixed",
          top: "150px",
          left: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          zIndex: 1000,
          padding: "12px",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Button style for share */}
        {(style => (
          <>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                article.title + " - " + window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={style("#25D366")}
            >
              📱
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={style("#1877F2")}
            >
              📘
            </a>

            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={style("#1DA1F2")}
            >
              🐦
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                window.location.href
              )}&title=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={style("#0077B5")}
            >
              💼
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }}
              style={style("#222")}
            >
              🔗
            </button>
          </>
        ))((bg: string) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "46px",
          height: "46px",
          background: bg,
          borderRadius: "50%",
          color: "#fff",
          fontSize: "20px",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          transition: "0.2s ease",
          transform: "scale(1)",
          hover: { transform: "scale(1.15)" },
        }))}
      </div>

      {/* ARTICLE HEADER */}
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "700",
          marginBottom: "20px",
          color: "#222",
        }}
      >
        {article.title}
      </h1>

      {/* READ / STOP BUTTONS */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "12px" }}>
        <button
          onClick={readPage}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "0.2s",
          }}
        >
          🔊 Read This Article
        </button>

        <button
          onClick={stopReading}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            background: "red",
            color: "white",
            border: "none",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "0.2s",
          }}
        >
          ⛔ Stop
        </button>
      </div>

      {/* IMAGE */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={article.title}
          style={{
            width: "100%",
            maxHeight: "450px",
            objectFit: "cover",
            borderRadius: "15px",
            marginBottom: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          }}
        />
      )}

      {/* DESCRIPTION */}
      <p style={{ fontSize: "1.1rem", color: "#444", marginTop: "10px" }}>
        {article.description}
      </p>
    </div>
  );
};

export default ArticleDetails;
