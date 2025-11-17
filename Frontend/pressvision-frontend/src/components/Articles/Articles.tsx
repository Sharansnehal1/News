// src/components/Articles/Articles.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "./ArticleCard";
import  type{ Article } from "./Types";

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/articles?populate=*")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setArticles(res.data.data);
        } else {
          console.error("Expected an array but got:", res.data.data);
          setArticles([]);
        }
      })
      .catch((error) => console.error("Error fetching articles:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
     <div>
            
            

 <div>
       {/* <h1>Articles</h1>
       {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{JSON.stringify(article.content)}</p>
          <small>{new Date(article.createdAt).toLocaleString()}</small>
        </div>
      ))} */}

    </div>
 
            

            <div
                className="modal fade"
                id="searchModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >

                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content rounded-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Search by keyword</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex align-items-center">
                            <div className="input-group w-75 mx-auto d-flex">
                                <input
                                    type="search"
                                    className="form-control p-3"
                                    placeholder="keywords"
                                    aria-describedby="search-icon-1"
                                />

                                <span id="search-icon-1" className="input-group-text p-3"><i className="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid features mb-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="row g-4 align-items-center features-item">
                                <div className="col-4">
                                    <div className="rounded-circle position-relative">
                                            {articles.map((article) => (
                                      
                                        <div key={article.id} className="overflow-hidden rounded-circle">
                                            <img   src={
                          article.image?.[0]?.url
                            ? `http://localhost:1337${article.image[0].url}`
                            : "https://via.placeholder.com/150" // fallback image
                        } className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                        </div>
                                            ))}
                                        <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                    </div>
                                </div>
                                   {articles.map((article) => (
                                <div  key={article.id} className="col-8">
                                    <div className="features-content d-flex flex-column">
                                        <p className="text-uppercase mb-2">{article.title}</p>
                                        
                                        <a href="#" className="h6">
                                             {article.content
    .map(
      (block) =>
        block.children
          ?.map((child) => child.text)
          .join(" ") 
    )
    .join(" ")} 
                                        </a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> {article.createdAt}</small>
                                    </div>
                                </div>
                                   ))}
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="row g-4 align-items-center features-item">
                                <div className="col-4">
                                    <div className="rounded-circle position-relative">
                                        <div className="overflow-hidden rounded-circle">
                                            <img src="img/features-technology.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                        </div>
                                        <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="features-content d-flex flex-column">
                                        <p className="text-uppercase mb-2">Technology</p>
                                        <a href="#" className="h6">
                                            Get the best speak market, news.
                                        </a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="row g-4 align-items-center features-item">
                                <div className="col-4">
                                    <div className="rounded-circle position-relative">
                                        <div className="overflow-hidden rounded-circle">
                                            <img src="img/features-fashion.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                        </div>
                                        <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="features-content d-flex flex-column">
                                        <p className="text-uppercase mb-2">Fashion</p>
                                        <a href="#" className="h6">
                                            Get the best speak market, news.
                                        </a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="row g-4 align-items-center features-item">
                                <div className="col-4">
                                    <div className="rounded-circle position-relative">
                                        <div className="overflow-hidden rounded-circle">
                                            <img src="img/features-life-style.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                        </div>
                                        <span
                                            className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute"
                                            style={{ top: "10%", right: "-10px" }}
                                        >
                                            3
                                        </span>

                                    </div>
                                </div>
                                    <div className="col-8">
                                        <div className="features-content d-flex flex-column">
                                            <p className="text-uppercase mb-2">Life Style</p>
                                            <a href="#" className="h6">
                                                Get the best speak market, news.
                                            </a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               

                <div className="container-fluid py-5">
                    <div className="container py-5">
                        <div className="row g-4">
                            <div className="col-lg-7 col-xl-8 mt-0">
                                <div className="position-relative overflow-hidden rounded">
                                    <img src="img/news-1.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                    <div
                                        className="d-flex justify-content-center px-4 position-absolute flex-wrap"
                                        style={{ bottom: "10px", left: 0 }}
                                    >

                                        <a href="#" className="text-white me-3 link-hover"><i className="fa fa-clock"></i> 06 minute read</a>
                                        <a href="#" className="text-white me-3 link-hover"><i className="fa fa-eye"></i> 3.5k Views</a>
                                        <a href="#" className="text-white me-3 link-hover"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                        <a href="#" className="text-white link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                    </div>
                                </div>
                                <div className="border-bottom py-3">
                                    <a href="#" className="display-4 text-dark mb-0 link-hover">Lorem Ipsum is simply dummy text of the printing</a>
                                </div>
                                <p className="mt-3 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley standard dummy text ever since the 1500s, when an unknown printer took a galley...
                                </p>
                                <div className="bg-light p-4 rounded">
                                    <div className="news-2">
                                        <h3 className="mb-4">Top Story</h3>
                                    </div>
                                    <div className="row g-4 align-items-center">
                                        <div className="col-md-6">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/news-2.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex flex-column">
                                                <a href="#" className="h3">Stoneman Clandestine Ukrainian claims successes against Russian.</a>
                                                <p className="mb-0 fs-5"><i className="fa fa-clock"> 06 minute read</i> </p>
                                                <p className="mb-0 fs-5"><i className="fa fa-eye"> 3.5k Views</i></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-xl-4">
                                <div className="bg-light rounded p-4 pt-0">
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/news-3.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex flex-column">
                                                <a href="#" className="h4 mb-2">Get the best speak market, news.</a>
                                                <p className="fs-5 mb-0"><i className="fa fa-clock"> 06 minute read</i> </p>
                                                <p className="fs-5 mb-0"><i className="fa fa-eye"> 3.5k Views</i></p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row g-4 align-items-center">
                                                <div className="col-5">
                                                    <div className="overflow-hidden rounded">
                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className="features-content d-flex flex-column">
                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                        <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                        <small><i className="fa fa-eye"> 3.5k Views</i></small>
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

                <div
                    className="container-fluid py-5 my-5"
                    style={{ background: "linear-gradient(rgba(202, 203, 185, 1), rgba(202, 203, 185, 1))" }}
                >

                    <div className="container">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-7">
                                <h1 className="mb-4 text-primary">Newsers</h1>
                                <h1 className="mb-4">Get Every Weekly Updates</h1>
                                <p className="text-dark mb-4 pb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                                </p>
                                <div className="position-relative mx-auto">
                                    <input
                                        className="form-control w-100 py-3 rounded-pill"
                                        type="email"
                                        placeholder="Your Business Email"
                                    />

                                    <button type="submit" className="btn btn-primary py-3 px-5 position-absolute rounded-pill text-white h-100" style={{ top: "0", right: "0" }}>Subscribe Now</button>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="rounded">
                                    <img src="/img/banner-img.jpg" className="img-fluid rounded w-100 rounded" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid latest-news py-5">
                    <div className="container py-5">
                        <h2 className="mb-4">Latest News</h2>
                        <div className="latest-news-carousel owl-carousel">
                            <div className="latest-news-item">
                                <div className="bg-light rounded">
                                    <div className="rounded-top overflow-hidden">
                                        
                                        <img src="/img/news-7.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                    </div>
                                    <div className="d-flex flex-column p-4">
                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="latest-news-item">
                                <div className="bg-light rounded">
                                    <div className="rounded-top overflow-hidden">
                                        <img src="/img/news-6.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                    </div>
                                    <div className="d-flex flex-column p-4">
                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="latest-news-item">
                                <div className="bg-light rounded">
                                    <div className="rounded-top overflow-hidden">
                                        <img src="/img/news-3.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                    </div>
                                    <div className="d-flex flex-column p-4">
                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="latest-news-item">
                                <div className="bg-light rounded">
                                    <div className="rounded-top overflow-hidden">
                                        <img src="/img/news-4.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                    </div>
                                    <div className="d-flex flex-column p-4">
                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="latest-news-item">
                                <div className="bg-light rounded">
                                    <div className="rounded-top overflow-hidden">
                                        <img src="/img/news-5.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                    </div>
                                    <div className="d-flex flex-column p-4">
                                        <a href="#" className="h4 ">Lorem Ipsum is simply dummy text of...</a>
                                        <div className="d-flex justify-content-between">
                                            <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                            <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid populer-news py-5">
                    <div className="container py-5">
                        <div className="tab-className mb-4">
                            <div className="row g-4">
                                <div className="col-lg-8 col-xl-9">
                                    <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom mb-4">
                                        <h1 className="mb-4">What’s New</h1>
                                        <ul className="nav nav-pills d-inline-flex text-center">
                                            <li className="nav-item mb-3">
                                                <a className="d-flex py-2 bg-light rounded-pill active me-2" data-bs-toggle="pill" href="#tab-1">
                                                    <span className="text-dark" style={{ width: "100px" }}>Sports</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mb-3">
                                                <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-2">
                                                    <span className="text-dark" style={{ width: "100px" }}>Magazine</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mb-3">
                                                <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-3">
                                                    <span className="text-dark" style={{ width: "100px" }}>Politics</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mb-3">
                                                <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-4">
                                                    <span className="text-dark" style={{ width: "100px" }}>Technology</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mb-3">
                                                <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-5">
                                                    <span className="text-dark" style={{ width: "100px" }}>Fashion</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content mb-4">
                                        <div id="tab-1" className="tab-pane fade show p-0 active">
                                            <div className="row g-4">
                                                <div className="col-lg-8">
                                                    <div className="position-relative rounded overflow-hidden">
                                                        <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                        <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                            Sports
                                                        </div>
                                                    </div>
                                                    <div className="my-4">
                                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                        <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                    </div>
                                                    <p className="my-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                    </p>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row g-4">
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Sports</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Sports</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Sports</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Sports</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab-2" className="tab-pane fade show p-0">
                                            <div className="row g-4">
                                                <div className="col-lg-8">
                                                    <div className="position-relative rounded overflow-hidden">
                                                        <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                        <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                            Magazine
                                                        </div>
                                                    </div>
                                                    <div className="my-3">
                                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                    </div>
                                                    <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                    </p>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                        <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row g-4">
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Magazine</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab-3" className="tab-pane fade show p-0">
                                            <div className="row g-4">
                                                <div className="col-lg-8">
                                                    <div className="position-relative rounded overflow-hidden">
                                                        <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                        <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                            Politics
                                                        </div>
                                                    </div>
                                                    <div className="my-3">
                                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                    </div>
                                                    <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                    </p>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                        <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row g-4">
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Politics</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Politics</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Politics</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Politics</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Politics</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab-4" className="tab-pane fade show p-0">
                                            <div className="row g-4">
                                                <div className="col-lg-8">
                                                    <div className="position-relative rounded overflow-hidden">
                                                        <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                        <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                            Technology
                                                        </div>
                                                    </div>
                                                    <div className="my-3">
                                                        <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                    </div>
                                                    <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy
                                                    </p>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                        <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row g-4">
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Technology</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Technology</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Technology</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Technology</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Technology</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab-5" className="tab-pane fade show p-0">
                                            <div className="row g-4">
                                                <div className="col-lg-8">
                                                    <div className="position-relative rounded overflow-hidden">
                                                        <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                        <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                            Fashion
                                                        </div>
                                                    </div>
                                                    <div className="my-3">
                                                        <a href="#" className="h4">World Happiness Report 2023: What's the highway to happiness?</a>
                                                    </div>
                                                    <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy
                                                    </p>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                        <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                        <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row g-4">
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Fashion</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Fashion</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Fashion</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Fashion</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="row g-4 align-items-center">
                                                                <div className="col-5">
                                                                    <div className="overflow-hidden rounded">
                                                                        <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="features-content d-flex flex-column">
                                                                        <p className="text-uppercase mb-2">Fashion</p>
                                                                        <a href="#" className="h6">Get the best speak market, news.</a>
                                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-bottom mb-4">
                                        <h2 className="my-4">Most Views News</h2>
                                    </div>
                                    <div className="whats-carousel owl-carousel">
                                        <div className="latest-news-item">
                                            <div className="bg-light rounded">
                                                <div className="rounded-top overflow-hidden">
                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column p-4">
                                                    <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="whats-item">
                                            <div className="bg-light rounded">
                                                <div className="rounded-top overflow-hidden">
                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column p-4">
                                                    <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="whats-item">
                                            <div className="bg-light rounded">
                                                <div className="rounded-top overflow-hidden">
                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column p-4">
                                                    <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="whats-item">
                                            <div className="bg-light rounded">
                                                <div className="rounded-top overflow-hidden">
                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column p-4">
                                                    <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="whats-item">
                                            <div className="bg-light rounded">
                                                <div className="rounded-top overflow-hidden">
                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column p-4">
                                                    <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                    <div className="d-flex justify-content-between">
                                                        <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 lifestyle">
                                        <div className="border-bottom mb-4">
                                            <h1 className="mb-4">Life Style</h1>
                                        </div>
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <div className="lifestyle-item rounded">
                                                    <img src="img/lifestyle-1.jpg" className="img-fluid w-100 rounded" alt="" />
                                                    <div className="lifestyle-content">
                                                        <div className="mt-auto">
                                                            <a href="#" className="h4 text-white link-hover">There are many variations of passages of Lorem Ipsum available,</a>
                                                            <div className="d-flex justify-content-between mt-4">
                                                                <a href="#" className="small text-white link-hover">By Willium Smith</a>
                                                                <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="lifestyle-item rounded">
                                                    <img src="img/lifestyle-2.jpg" className="img-fluid w-100 rounded" alt="" />
                                                    <div className="lifestyle-content">
                                                        <div className="mt-auto">
                                                            <a href="#" className="h4 text-white link-hover">There are many variations of passages of Lorem Ipsum available,</a>
                                                            <div className="d-flex justify-content-between mt-4">
                                                                <a href="#" className="small text-white link-hover">By Willium Smith</a>
                                                                <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-xl-3">
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <div className="p-3 rounded border">
                                                <h4 className="mb-4">Stay Connected</h4>
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <a href="#" className="w-100 rounded btn btn-primary d-flex align-items-center p-3 mb-2">
                                                            <i className="fab fa-facebook-f btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">13,977 Fans</span>
                                                        </a>
                                                        <a href="#" className="w-100 rounded btn btn-danger d-flex align-items-center p-3 mb-2">
                                                            <i className="fab fa-twitter btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">21,798 Follower</span>
                                                        </a>
                                                        <a href="#" className="w-100 rounded btn btn-warning d-flex align-items-center p-3 mb-2">
                                                            <i className="fab fa-youtube btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">7,999 Subscriber</span>
                                                        </a>
                                                        <a href="#" className="w-100 rounded btn btn-dark d-flex align-items-center p-3 mb-2">
                                                            <i className="fab fa-instagram btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">19,764 Follower</span>
                                                        </a>
                                                        <a href="#" className="w-100 rounded btn btn-secondary d-flex align-items-center p-3 mb-2">
                                                            <i className="bi-cloud btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">31,999 Subscriber</span>
                                                        </a>
                                                        <a href="#" className="w-100 rounded btn btn-warning d-flex align-items-center p-3 mb-4">
                                                            <i className="fab fa-dribbble btn btn-light btn-square rounded-circle me-3"></i>
                                                            <span className="text-white">37,999 Subscriber</span>
                                                        </a>
                                                    </div>
                                                </div>
                                                <h4 className="my-4">Popular News</h4>
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center features-item">
                                                            <div className="col-4">
                                                                <div className="rounded-circle position-relative">
                                                                    <div className="overflow-hidden rounded-circle">
                                                                        <img src="img/features-sports-1.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                    </div>
                                                                    <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Sports</p>
                                                                    <a href="#" className="h6">
                                                                        Get the best speak market, news.
                                                                    </a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center features-item">
                                                            <div className="col-4">
                                                                <div className="rounded-circle position-relative">
                                                                    <div className="overflow-hidden rounded-circle">
                                                                        <img src="img/features-technology.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                    </div>
                                                                    <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">
                                                                        Get the best speak market, news.
                                                                    </a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center features-item">
                                                            <div className="col-4">
                                                                <div className="rounded-circle position-relative">
                                                                    <div className="overflow-hidden rounded-circle">
                                                                        <img src="img/features-fashion.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                    </div>
                                                                    <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">
                                                                        Get the best speak market, news.
                                                                    </a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center features-item">
                                                            <div className="col-4">
                                                                <div className="rounded-circle position-relative">
                                                                    <div className="overflow-hidden rounded-circle">
                                                                        <img src="img/features-life-style.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                    </div>
                                                                    <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Life Style</p>
                                                                    <a href="#" className="h6">
                                                                        Get the best speak market, news.
                                                                    </a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <a href="#" className="link-hover btn border border-primary rounded-pill text-dark w-100 py-3 mb-4">View More</a>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="border-bottom my-3 pb-3">
                                                            <h4 className="mb-0">Trending Tags</h4>
                                                        </div>
                                                        <ul className="nav nav-pills d-inline-flex text-center mb-4">
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Lifestyle</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Sports</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Politics</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Magazine</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Game</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Movie</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>Travel</span>
                                                                </a>
                                                            </li>
                                                            <li className="nav-item mb-3">
                                                                <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                    <span className="text-dark link-hover" style={{ width: "90px" }}>World</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="position-relative banner-2">
                                                            <img src="img/banner-2.jpg" className="img-fluid w-100 rounded" alt="" />
                                                            <div className="text-center banner-content-2">
                                                                <h6 className="mb-2">The Most Populer</h6>
                                                                <p className="text-white mb-2">News & Magazine WP Theme</p>
                                                                <a href="#" className="btn btn-primary text-white px-4">Shop Now</a>
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
                    </div>
                </div>

              

               

            </div>
        


  );
};

export default Articles;
