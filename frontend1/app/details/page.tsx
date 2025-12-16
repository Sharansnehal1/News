"use client";
import React, { useEffect, useState } from "react";
import "./page.css";

import axios from "axios";
import { Article } from "@/types/article"; // your existing interface

export default function Detailspage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speech state
   const [comment, setComment] = useState("");
  const [Name, setName] = useState("");
    const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      debugger;
      const res = await axios.post(
        "http://localhost:5000/comments/save-comment",
        {
          comment,
          Name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("Comment submission response:", res);
      if (res.data.success) {
        alert("Comment submitted");
        setComment("");
        setName("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/article-contents?populate=*")
      .then((res) => {
        const firstArticle = res.data.data?.[0] as Article;
        console.log("First article:", firstArticle);
        setArticle(firstArticle);
      })
      .catch((err) => console.error("API Error:", err));

    // Stop speech on unmount / page navigation
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false); // reset button state
    };
  }, []);

  if (!article)
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>
    );

  // Combine content blocks if present
  const formattedContent = article.content
    ?.map((block) =>
      block.children?.map((child: { text: string }) => child.text).join(" ")
    )
    .join("\n\n");

  // Main image URL
  const mainImage =
    article.image?.[0]?.url && `http://localhost:1337${article.image[0].url}`;

  // --- Speech Function ---
  const handleReadAloud = () => {
    if (!article) return;

    // If already speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `
      ${article.title}.
      ${article.description}.
      ${formattedContent || ""}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1; // speed
    utterance.pitch = 1; // pitch
    utterance.lang = "en-US"; // language

    utterance.onend = () => {
      setIsSpeaking(false); // Reset button state when done
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  

  return (
    <div>
      <div className="about-area">
        <div className="container">
          {/* Trending Section */}
          <div className="row">
            <div className="col-lg-12">
              <div className="trending-tittle d-flex justify-content-between align-items-center">
                <div>
                  <strong>Trending now</strong>
                  <p>{article.category}</p><br/>
<div className="author-hover">
  <p className="author-name">Author : {article.author}</p>

  {/* Hover Card */}
  <div className="author-card">
    {article.ProfilePhoto?.[0]?.url && (
      <img
        src={`http://localhost:1337${article.ProfilePhoto[0].url}`}
        alt={article.author}
        className="author-card-img"
         onClick={() => setOpen(true)}
      />
    )}

    <div className="author-card-info">
      <h4>{article.author}</h4>
      <p>{article.designation} , {article.location}</p>
      
      
    </div>
  </div>
</div>

<br/>
 {/* Popup Modal */}
      {open && (
        <div className="author-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="author-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn" 
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <img
              src={`http://localhost:1337${article.ProfilePhoto?.[0]?.url}`}
              alt={article.author}
              className="author-modal-img"
            />

            <h3>{article.author}</h3>
            <p className="author-about">
             {article.About}
            </p>
          </div>
        </div>
      )}

                  <p>
  Created  at:{" "}
  {new Date(article.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })}
</p>

                </div>
                <button
                  className="button button-primary"
                  onClick={handleReadAloud}
                  style={{ color: "#0d0c0cff" }} // Make text visible
                >
                  {isSpeaking ? "⏹ Stop" : "🔊 Read Aloud"}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {/* LEFT CONTENT */}
            <div className="col-lg-8">
              <div className="about-right mb-90">
                {/* Article Image */}
                <div className="about-img">
                  <img
                    src={mainImage || "/assets/img/trending/trending_top.jpg"}
                    alt={article.title}
                  />
                </div>

                {/* Article Title */}
                <div className="section-tittle mb-30 pt-30">
                  <h3>{article.title}</h3>
                </div>

                {/* Article Description & Content */}
                <div className="about-prea">
                  <p className="about-pera1 mb-25">{article.description}</p>
                  {formattedContent && (
                    <p
                      className="about-pera1 mb-25"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {formattedContent}
                    </p>
                  )}
                </div>

                {/* Social Share */}
                <div className="social-share pt-30">
                  <div className="section-tittle">
                    <h3 className="mr-20">Share:</h3>
                    <ul>
                   <li>
        <a
          href={`https://www.instagram.com/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/img/news/icon-ins.png" alt="Instagram" />
        </a>
      </li>

       {/* Facebook */}
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/img/news/icon-fb.png" alt="Facebook" />
        </a>
      </li>

       {/* YouTube */}
      <li>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/img/news/icon-yo.png" alt="YouTube" />
        </a>
      </li>
      </ul>
                  </div>
                </div>
              </div>

              {/* Comment Form */}
              <div className="row">
                <div className="col-lg-8">
                  <form
                    className="form-contact contact_form mb-80"
                    action="#"
                    method="post" onSubmit={handleSubmit}
                  >
                    <div className="row">
                      <div className="col-12">
                        <textarea
                          className="form-control w-100"
                          placeholder="Enter Comment"
                        
                          value={comment} onChange={(e) => setComment(e.target.value)}>
                        </textarea>
                        
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter your name"
                           value={Name}
            onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {/* <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Email"
                        />
                      </div>
                      <div className="col-12">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Subject"
                        />
                      </div> */}
                    </div>
                    <div className="form-group mt-3">
                      <button
                        type="submit"
                        className="button button-contactForm boxed-btn"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="col-lg-4">
              <div className="section-tittle mb-40">
                <h3>Follow Us</h3>
              </div>

              <div className="single-follow mb-45">
                <div className="single-box">
                  {["icon-fb", "icon-tw", "icon-ins", "icon-yo"].map(
                    (icon, i) => (
                      <div
                        className="follow-us d-flex align-items-center"
                        key={i}
                      >
                        <div className="follow-social">
                          <a href="#">
                            <img
                              src={`/assets/img/news/${icon}.png`}
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="follow-count">
                          <span>8,045</span>
                          <p>Fans</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="news-poster d-none d-lg-block">
                <img src="/assets/img/news/news_card.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
