"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";

export default function Detailspage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const USER_ID = 2;

  const handleAddToReadList = async () => {
    if (!article) return;
    try {
      await axios.post("http://localhost:5000/readlist", {
        user_id: USER_ID,
        article_id: article.id
      });
      alert("Added to Read List!");
      setShowDropdown(false);
    } catch (err) {
      console.error("ReadList Error:", err);
      alert("Already in ReadList or server error");
    }
  };

  const handleAddToReadLater = async () => {
    if (!article) return;
    try {
      await axios.post("http://localhost:5000/readlater", {
        user_id: USER_ID,
        article_id: article.id
      });
      alert("Added to Read Later!");
      setShowDropdown(false);
    } catch (err) {
      console.error("ReadLater Error:", err);
      alert("Already in ReadLater or server error");
    }
  };

  const handleReportArticle = async () => {
    if (!article) return;
    const reason = prompt("Why are you reporting this article?");
    try {
      await axios.post("http://localhost:5000/report", {
        user_id: USER_ID,
        article_id: article.id,
        reason: reason || "No reason given"
      });
      alert("Report submitted. Thank you!");
      setShowDropdown(false);
    } catch (err) {
      console.error("Report Error:", err);
      alert("Failed to report");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/article-contents?populate=*")
      .then((res) => {
        const firstArticle = res.data.data?.[0] as Article;
        setArticle(firstArticle);
      })
      .catch((err) => console.error("API Error:", err));

    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, []);

  if (!article)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

  const formattedContent = article.content
    ?.map((block) =>
      block.children?.map((child: { text: string }) => child.text).join(" ")
    )
    .join("\n\n");

  const mainImage =
    article.image?.[0]?.url && `http://localhost:1337${article.image[0].url}`;

  const handleReadAloud = () => {
    if (!article) return;

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
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsSpeaking(false);
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
                  <p>{article.category}</p>
                </div>
                <button
                  className="button button-primary"
                  onClick={handleReadAloud}
                  style={{ color: "#0d0c0cff" }}
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
                <div className="about-img position-relative overflow-hidden rounded-3 shadow-sm mb-4">
                  <img
                    src={mainImage || "/assets/img/trending/trending_top.jpg"}
                    alt={article.title}
                    className="w-100 h-auto"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Article Title with Actions */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="section-tittle flex-grow-1">
                    <h1 className="display-5 fw-bold text-dark mb-0">{article.title}</h1>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <div className="position-relative ms-3">
                    <button
                      className="btn btn-light border d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                      onClick={() => setShowDropdown(!showDropdown)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                      </svg>
                      <span className="fw-medium">Actions</span>
                    </button>

                    {showDropdown && (
                      <>
                        <div 
                          className="position-fixed top-0 start-0 w-100 h-100" 
                          style={{ zIndex: 999 }}
                          onClick={() => setShowDropdown(false)}
                        />
                        <div
                          className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg"
                          style={{ 
                            minWidth: "220px", 
                            zIndex: 1000,
                            animation: "fadeIn 0.15s ease-in"
                          }}
                        >
                          <div className="py-2">
                            <button
                              className="dropdown-item d-flex align-items-center gap-3 px-4 py-3 border-0 bg-transparent w-100 text-start"
                              onClick={handleAddToReadList}
                              style={{ transition: "background-color 0.2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <svg width="18" height="18" fill="#0d6efd" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                              </svg>
                              <span className="fw-medium text-dark">Add to Reading List</span>
                            </button>

                            <button
                              className="dropdown-item d-flex align-items-center gap-3 px-4 py-3 border-0 bg-transparent w-100 text-start"
                              onClick={handleAddToReadLater}
                              style={{ transition: "background-color 0.2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <svg width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                              </svg>
                              <span className="fw-medium text-dark">Read Later</span>
                            </button>

                            <hr className="my-2 mx-3" />

                            <button
                              className="dropdown-item d-flex align-items-center gap-3 px-4 py-3 border-0 bg-transparent w-100 text-start"
                              onClick={handleReportArticle}
                              style={{ transition: "background-color 0.2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fff5f5"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <svg width="18" height="18" fill="#dc3545" viewBox="0 0 16 16">
                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                              </svg>
                              <span className="fw-medium text-danger">Report Article</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
                      {["icon-ins", "icon-fb", "icon-tw", "icon-yo"].map(
                        (icon, i) => (
                          <li key={i}>
                            <a href="#">
                              <img
                                src={`/assets/img/news/${icon}.png`}
                                alt=""
                              />
                            </a>
                          </li>
                        )
                      )}
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
                    method="post"
                  >
                    <div className="row">
                      <div className="col-12">
                        <textarea
                          className="form-control w-100"
                          placeholder="Enter Message"
                        ></textarea>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="col-sm-6">
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
                      </div>
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}