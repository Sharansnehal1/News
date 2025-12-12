"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchArticles } from "@/services/api";
import { Article } from "@/types/article";
import axios from "axios";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState(""); // track textarea value

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  

  // Fetch articles
  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getArticles();
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsNotesOpen(false);
      }
    };

    if (isNotesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotesOpen]);

  if (isLoading) {
    return <p className="text-center mt-20 text-gray-500 text-xl">Loading...</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-center mt-20 text-gray-500 text-xl">No articles found</p>;
  }
 const openNotesFor = (article: Article) => {
    setSelectedArticle(article);
    setIsNotesOpen(true);
  };
  const featured = articles[0]; // Main headline article
  const others = articles.slice(1);

   // ✅ Define saveNote inside component
  const saveNote = async () => {
    if (!note.trim()) {
      alert("Note cannot be empty");
      return;
    }
if (!selectedArticle) return alert("No article selected");
    try {
          const token = localStorage.getItem("token");
          debugger; 
      const response = await axios.post("http://localhost:5000/notes/save-notes", {
        notes_text: note,
        canvas_image: "",
        articleId: selectedArticle.id, // Pass the current article's ID
      },
        {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },
    
      });

      if (response.data.success) {
        alert("Note saved!");
        setNote(""); // clear textarea
      } else {
        alert("Failed to save note");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving note");
    }
  };

  return (
    <div>
      {/* Preloader */}
      <div id="preloader-active">
        <div className="d-flex align-items-center justify-content-center">
          <div className="preloader-inner position-relative">
            <div className="preloader-circle"></div>
            <div className="preloader-img pere-text">
              <img src="assets/img/logo/logo.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="trending-area fix relative">
        <div className="container">
          <div className="trending-main flex">
            {/* Trending Articles */}
           

            {/* Notes Sidebar */}
           <div className="flex">
      {/* --------------------- LEFT COLUMN (NEWS) -------------------- */}
      <div className="w-3/4 p-4">

        {/* Featured Article */}
        <div className="p-4 border rounded mb-4 shadow bg-white">
            <h3 className="mt-2 font-semibold text-gray-800">
                      <a href="/details">{featured.title}</a>
                    </h3>
         
            {featured.image?.[0]?.url && (
                      <img
                        src={`http://localhost:1337${featured.image[0].url}`}
                        alt={featured.title}
                        className="w-full h-40 object-cover rounded"
                      />
                    )}
          <button
            onClick={() => openNotesFor(featured)}
            className="mt-3 bg-blue-600 text-white px-3 py-2 rounded"
          >
            Take Notes
          </button>
        </div>

        {/* Other Articles */}
        {others.map((article) => (
          <div
            key={article.id}
            className="p-4 border rounded mb-3 shadow-sm bg-white"
          >
              <h3 className="mt-2 font-semibold">
                      <a href="/details">{article.title}</a>
                    </h3>
{article.image?.[0]?.url && (
                      <img
                        src={`http://localhost:1337${article.image[0].url}`}
                        alt={article.title}
                        className="w-full h-40 object-cover rounded"
                      />
                    )}
            <button
              onClick={() => openNotesFor(article)}
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Take Notes
            </button>
          </div>
        ))}
      </div>

      {/* --------------------- RIGHT SIDEBAR (NOTES) -------------------- */}
      <div className="w-1/4 relative">
        <div
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            isNotesOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Your Notes</h3>
            <button
              onClick={toggleNotes}
              className="text-gray-600 hover:text-gray-900"
            >
              ➜
            </button>
          </div>

          {/* Selected Article Title */}
          {selectedArticle && (
            <div className="p-4 border-b bg-gray-50">
              <h4 className="text-xs text-gray-600">Notes for:</h4>
              <p className="font-semibold text-sm mt-1">
                {selectedArticle.title}
              </p>
            </div>
          )}

          {/* Notes Input */}
          <div className="p-4">
            <textarea
              placeholder="Write your notes here..."
              className="w-full h-[300px] border rounded p-2 resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <button
              onClick={saveNote}
              className="mt-2 bg-blue-600 text-white p-2 rounded w-full"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        {!isNotesOpen && (
          <button
            onClick={toggleNotes}
            className="fixed top-1/2 right-0 bg-blue-600 text-white p-2 rounded-l shadow-lg z-40"
          >
            Notes
          </button>
        )}
      </div>
    </div>
          </div>
        </div>
      </div>
 
    <div className="weekly-news-area pt-50">
        <div className="container">
           <div className="weekly-wrapper">
             
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle mb-30">
                            <h3>Weekly Top News</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="weekly-news-active dot-style d-flex dot-style">
                            <div className="weekly-single">
                                <div className="weekly-img">
                                    <img src="assets/img/news/weeklyNews2.jpg" alt=""/>
                                </div>
                                <div className="weekly-caption">
                                    <span className="color1">Strike</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div> 
                            <div className="weekly-single active">
                                <div className="weekly-img">
                                        <img src="assets/img/news/weeklyNews1.jpg" alt=""/>
                                </div>
                                <div className="weekly-caption">
                                    <span className="color1">Strike</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                            <div className="weekly-single">
                                <div className="weekly-img">
                                        <img src="assets/img/news/weeklyNews3.jpg" alt=""/>
                                </div>
                                <div className="weekly-caption">
                                    <span className="color1">Strike</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                            <div className="weekly-single">
                                <div className="weekly-img">
                                    <img src="assets/img/news/weeklyNews1.jpg" alt=""/>
                                </div>
                                <div className="weekly-caption">
                                    <span className="color1">Strike</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    </div>           
    
    <section className="whats-news-area pt-50 pb-20">
        <div className="container">
            <div className="row">
            <div className="col-lg-8">
                <div className="row d-flex justify-content-between">
                    <div className="col-lg-3 col-md-3">
                        <div className="section-tittle mb-30">
                            <h3>Whats New</h3>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-9">
                        <div className="properties__button">
                                                                     
                            <nav>                                                                     
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">All</a>
                                    <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Lifestyle</a>
                                    <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Travel</a>
                                    <a className="nav-item nav-link" id="nav-last-tab" data-toggle="tab" href="#nav-last" role="tab" aria-controls="nav-contact" aria-selected="false">Fashion</a>
                                    <a className="nav-item nav-link" id="nav-Sports" data-toggle="tab" href="#nav-nav-Sport" role="tab" aria-controls="nav-contact" aria-selected="false">Sports</a>
                                    <a className="nav-item nav-link" id="nav-technology" data-toggle="tab" href="#nav-techno" role="tab" aria-controls="nav-contact" aria-selected="false">Technology</a>
                                </div>
                            </nav>
                            
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                       
                        <div className="tab-content" id="nav-tabContent">
                            
                            <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">           
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    
                            <div className="tab-pane fade" id="nav-last" role="tabpanel" aria-labelledby="nav-last-tab">
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="tab-pane fade" id="nav-nav-Sport" role="tabpanel" aria-labelledby="nav-Sports">
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="tab-pane fade" id="nav-techno" role="tabpanel" aria-labelledby="nav-technology">
                                <div className="whats-news-caption">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews1.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews2.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews3.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="single-what-news mb-100">
                                                <div className="what-img">
                                                    <img src="assets/img/news/whatNews4.jpg" alt=""/>
                                                </div>
                                                <div className="what-cap">
                                                    <span className="color1">Night party</span>
                                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
            <div className="col-lg-4">
               
                <div className="section-tittle mb-40">
                    <h3>Follow Us</h3>
                </div>
          
                <div className="single-follow mb-45">
                    <div className="single-box">
                        <div className="follow-us d-flex align-items-center">
                            <div className="follow-social">
                                <a href="#"><img src="assets/img/news/icon-fb.png" alt=""/></a>
                            </div>
                            <div className="follow-count">  
                                <span>8,045</span>
                                <p>Fans</p>
                            </div>
                        </div> 
                        <div className="follow-us d-flex align-items-center">
                            <div className="follow-social">
                                <a href="#"><img src="assets/img/news/icon-tw.png" alt=""/></a>
                            </div>
                            <div className="follow-count">
                                <span>8,045</span>
                                <p>Fans</p>
                            </div>
                        </div>
                            <div className="follow-us d-flex align-items-center">
                            <div className="follow-social">
                                <a href="#"><img src="assets/img/news/icon-ins.png" alt=""/></a>
                            </div>
                            <div className="follow-count">
                                <span>8,045</span>
                                <p>Fans</p>
                            </div>
                        </div>
                        <div className="follow-us d-flex align-items-center">
                            <div className="follow-social">
                                <a href="#"><img src="assets/img/news/icon-yo.png" alt=""/></a>
                            </div>
                            <div className="follow-count">
                                <span>8,045</span>
                                <p>Fans</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="news-poster d-none d-lg-block">
                    <img src="assets/img/news/news_card.jpg" alt=""/>
                </div>
            </div>
            </div>
        </div>
    </section>
   
    <div className="weekly2-news-area  weekly2-pading gray-bg">
        <div className="container">
            <div className="weekly2-wrapper">
                
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle mb-30">
                            <h3>Weekly Top News</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="weekly2-news-active dot-style d-flex dot-style">
                            <div className="weekly2-single">
                                <div className="weekly2-img">
                                    <img src="assets/img/news/weekly2News1.jpg" alt=""/>
                                </div>
                                <div className="weekly2-caption">
                                    <span className="color1">Corporate</span>
                                    <p>25 Jan 2020</p>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div> 
                            <div className="weekly2-single">
                                <div className="weekly2-img">
                                    <img src="assets/img/news/weekly2News2.jpg" alt=""/>
                                </div>
                                <div className="weekly2-caption">
                                    <span className="color1">Event night</span>
                                    <p>25 Jan 2020</p>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div> 
                            <div className="weekly2-single">
                                <div className="weekly2-img">
                                    <img src="assets/img/news/weekly2News3.jpg" alt=""/>
                                </div>
                                <div className="weekly2-caption">
                                    <span className="color1">Corporate</span>
                                    <p>25 Jan 2020</p>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                             <div className="weekly2-single">
                                <div className="weekly2-img">
                                    <img src="assets/img/news/weekly2News4.jpg" alt=""/>
                                </div>
                                <div className="weekly2-caption">
                                    <span className="color1">Event time</span>
                                    <p>25 Jan 2020</p>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div> 
                             <div className="weekly2-single">
                                <div className="weekly2-img">
                                    <img src="assets/img/news/weekly2News4.jpg" alt=""/>
                                </div>
                                <div className="weekly2-caption">
                                    <span className="color1">Corporate</span>
                                    <p>25 Jan 2020</p>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>           

    <div className="youtube-area video-padding">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="video-items-active">
                        <div className="video-items text-center">
                            <iframe src="https://www.youtube.com/embed/CicQIuG8hBo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <div className="video-items text-center">
                            <iframe  src="https://www.youtube.com/embed/rIz00N40bag" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <div className="video-items text-center">
                            <iframe src="https://www.youtube.com/embed/CONfhrASy44" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                        </div>
                        <div className="video-items text-center">
                            <iframe src="https://www.youtube.com/embed/lq6fL2ROWf8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                         
                        </div>
                        <div className="video-items text-center">
                            <iframe src="https://www.youtube.com/embed/0VxlQlacWV4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div className="video-info">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="video-caption">
                            <div className="top-caption">
                                <span className="color1">Politics</span>
                            </div>
                            <div className="bottom-caption">
                                <h2>Welcome To The Best Model Winner Contest At Look of the year</h2>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod ipsum dolor sit. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod ipsum dolor sit. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod ipsum dolor sit lorem ipsum dolor sit.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="testmonial-nav text-center">
                            <div className="single-video">
                                <iframe  src="https://www.youtube.com/embed/CicQIuG8hBo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <div className="video-intro">
                                    <h4>Welcotme To The Best Model Winner Contest</h4>
                                </div>
                            </div>
                            <div className="single-video">
                                <iframe  src="https://www.youtube.com/embed/rIz00N40bag" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <div className="video-intro">
                                    <h4>Welcotme To The Best Model Winner Contest</h4>
                                </div>
                            </div>
                            <div className="single-video">
                                <iframe src="https://www.youtube.com/embed/CONfhrASy44" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <div className="video-intro">
                                    <h4>Welcotme To The Best Model Winner Contest</h4>
                                </div>
                            </div>
                            <div className="single-video">
                                <iframe src="https://www.youtube.com/embed/lq6fL2ROWf8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <div className="video-intro">
                                    <h4>Welcotme To The Best Model Winner Contest</h4>
                                </div>
                            </div>
                            <div className="single-video">
                                <iframe src="https://www.youtube.com/embed/0VxlQlacWV4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <div className="video-intro">
                                    <h4>Welcotme To The Best Model Winner Contest</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    
    <div className="recent-articles">
        <div className="container">
           <div className="recent-wrapper">
                
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-tittle mb-30">
                            <h3>Recent Articles</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="recent-active dot-style d-flex dot-style">
                            <div className="single-recent mb-100">
                                <div className="what-img">
                                    <img src="assets/img/news/recent1.jpg" alt=""/>
                                </div>
                                <div className="what-cap">
                                    <span className="color1">Night party</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                            <div className="single-recent mb-100">
                                <div className="what-img">
                                    <img src="assets/img/news/recent2.jpg" alt=""/>
                                </div>
                                <div className="what-cap">
                                    <span className="color1">Night party</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                            <div className="single-recent mb-100">
                                <div className="what-img">
                                    <img src="assets/img/news/recent3.jpg" alt=""/>
                                </div>
                                <div className="what-cap">
                                    <span className="color1">Night party</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                            <div className="single-recent mb-100">
                                <div className="what-img">
                                    <img src="assets/img/news/recent2.jpg" alt=""/>
                                </div>
                                <div className="what-cap">
                                    <span className="color1">Night party</span>
                                    <h4><a href="#">Welcome To The Best Model  Winner Contest</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    </div>           
    
    <div className="pagination-area pb-45 text-center">
        <div className="container">
            <div className="row">
                <div className="col-xl-12">
                    <div className="single-wrap d-flex justify-content-center">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-start">
                              <li className="page-item"><a className="page-link" href="#"><span className="flaticon-arrow roted"></span></a></li>
                                <li className="page-item active"><a className="page-link" href="#">01</a></li>
                                <li className="page-item"><a className="page-link" href="#">02</a></li>
                                <li className="page-item"><a className="page-link" href="#">03</a></li>
                              <li className="page-item"><a className="page-link" href="#"><span className="flaticon-arrow right-arrow"></span></a></li>
                            </ul>
                          </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    
   
   
        
   

   
  );
}



