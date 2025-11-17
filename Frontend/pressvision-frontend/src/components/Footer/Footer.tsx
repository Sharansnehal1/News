// src/components/Footer/Footer.tsx
import React from "react";

const Footer: React.FC = () => (
    <div>
     <div className="container-fluid bg-dark footer py-5">
                    <div className="container py-5">
                        <div className="pb-4 mb-4" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                            <div className="row g-4">
                                <div className="col-lg-3">
                                    <a href="#" className="d-flex flex-column flex-wrap">
                                        <p className="text-white mb-0 display-6">Newsers</p>
                                        <small className="text-light" style={{ letterSpacing: "11px", lineHeight: 0 }}>
                                            Newspaper
                                        </small>

                                    </a>
                                </div>
                                <div className="col-lg-9">
                                    <div className="d-flex position-relative rounded-pill overflow-hidden">
                                        <input
                                            className="form-control border-0 w-100 py-3 rounded-pill"
                                            type="email"
                                            placeholder="example@gmail.com"
                                        />

                                        <button type="submit" className="btn btn-primary border-0 py-3 px-5 rounded-pill text-white position-absolute" style={{ top: "0", right: "0" }}>Subscribe Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-5">
                            <div className="col-lg-6 col-xl-3">
                                <div className="footer-item-1">
                                    <h4 className="mb-4 text-white">Get In Touch</h4>
                                    <p className="text-secondary line-h">Address: <span className="text-white">123 Streat, New York</span></p>
                                    <p className="text-secondary line-h">Email: <span className="text-white">Example@gmail.com</span></p>
                                    <p className="text-secondary line-h">Phone: <span className="text-white">+0123 4567 8910</span></p>
                                    <div className="d-flex line-h">
                                        <a className="btn btn-light me-2 btn-md-square rounded-circle" href=""><i className="fab fa-twitter text-dark"></i></a>
                                        <a className="btn btn-light me-2 btn-md-square rounded-circle" href=""><i className="fab fa-facebook-f text-dark"></i></a>
                                        <a className="btn btn-light me-2 btn-md-square rounded-circle" href=""><i className="fab fa-youtube text-dark"></i></a>
                                        <a className="btn btn-light btn-md-square rounded-circle" href=""><i className="fab fa-linkedin-in text-dark"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-3">
                                <div className="footer-item-2">
                                    <div className="d-flex flex-column mb-4">
                                        <h4 className="mb-4 text-white">Recent Posts</h4>
                                        <a href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle border border-2 border-primary overflow-hidden">
                                                    <img src="img/footer-1.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column ps-4">
                                                    <p className="text-uppercase text-white mb-3">Life Style</p>
                                                    {/* <a href="#" className="h6 text-white">
                                                        Get the best speak market, news.
                                                    </a> */}
                                                    <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <a href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle border border-2 border-primary overflow-hidden">
                                                    <img src="img/footer-2.jpg" className="img-zoominimg-fluid rounded-circle w-100" alt="" />
                                                </div>
                                                <div className="d-flex flex-column ps-4">
                                                    <p className="text-uppercase text-white mb-3">Sports</p>
                                                    {/* <a href="#" className="h6 text-white">
                                                        Get the best speak market, news.
                                                    </a> */}
                                                    <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-3">
                                <div className="d-flex flex-column text-start footer-item-3">
                                    <h4 className="mb-4 text-white">Categories</h4>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Sports</a>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Magazine</a>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Lifestyle</a>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Politician</a>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Technology</a>
                                    <a className="btn-link text-white" href=""><i className="fas fa-angle-right text-white me-2"></i> Intertainment</a>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-3">
                                <div className="footer-item-4">
                                    <h4 className="mb-4 text-white">Our Gallary</h4>
                                    <div className="row g-2">
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-2.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded overflow-hidden">
                                                <img src="img/footer-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid copyright bg-dark py-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                <span className="text-light"><a href="#"><i className="fas fa-copyright text-light me-2"></i>Your Site Name</a>, All right reserved.</span>
                            </div>
                            <div className="col-md-6 my-auto text-center text-md-end text-white">

                                Designed By <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
       
);

export default Footer;
