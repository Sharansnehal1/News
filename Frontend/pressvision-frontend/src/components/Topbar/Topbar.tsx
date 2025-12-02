// src/components/Topbar/Topbar.tsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";


const Topbar: React.FC = () => {
const { user, logoutUser } = useContext(AuthContext)!;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="container-fluid sticky-top px-0">

      {/* TOP DARK BAR */}
      <div className="container-fluid topbar bg-dark d-none d-lg-block">
        <div className="container px-0">
          <div className="topbar-top d-flex justify-content-between flex-lg-wrap">

            {/* Trending section */}
            <div className="top-info flex-grow-0">
              <span className="rounded-circle btn-sm-square bg-primary me-2">
                <i className="fas fa-bolt text-white"></i>
              </span>

              <div className="pe-2 me-3 border-end border-white d-flex align-items-center">
                <p className="mb-0 text-white fs-6 fw-normal">Trending</p>
              </div>

              <div className="overflow-hidden" style={{ width: "735px" }}>
                <div id="note" className="ps-2">
                  <img
                    src="img/features-fashion.jpg"
                    className="img-fluid rounded-circle border border-3 border-primary me-2"
                    style={{ width: "30px", height: "30px" }}
                    alt=""
                  />
                  <a href="#">
                    <p className="text-white mb-0 link-hover">
                      Breaking News: Newsan unknown printer took a galley of type and scrambled Newsan.
                    </p>
                  </a>
                </div>
              </div>
            </div>

            {/* Date + Social */}
            <div className="top-link flex-lg-wrap">
              <i className="fas fa-calendar-alt text-white border-end border-secondary pe-2 me-2">
                <span className="text-body"> Tuesday, Sep 12, 2024</span>
              </i>

              <div className="d-flex icon">
                <p className="mb-0 text-white me-2">Follow Us:</p>
                <a href="#" className="me-2"><i className="fab fa-facebook-f text-body"></i></a>
                <a href="#" className="me-2"><i className="fab fa-twitter text-body"></i></a>
                <a href="#" className="me-2"><i className="fab fa-instagram text-body"></i></a>
                <a href="#" className="me-2"><i className="fab fa-youtube text-body"></i></a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="container-fluid bg-light">
        <div className="container px-0">
          <nav className="navbar navbar-light navbar-expand-xl">
            
            <Link to="/" className="navbar-brand mt-3">
              <p className="text-primary display-6 mb-2" style={{ lineHeight: 0 }}>
                Newsers
              </p>
              <small className="text-body fw-normal" style={{ letterSpacing: "12px" }}>
                Newspaper
              </small>
            </Link>

            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary"></span>
            </button>

            <div className="collapse navbar-collapse bg-light py-3" id="navbarCollapse">
              <div className="navbar-nav mx-auto border-top">
                <Link to="/" className="nav-item nav-link active">Home</Link>
                <a href="#" className="nav-item nav-link">Detail Page</a>
                <a href="#" className="nav-item nav-link">404 Page</a>

                <div className="nav-item dropdown">
                  <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                    Dropdown
                  </a>
                  <div className="dropdown-menu bg-secondary rounded-0">
                    <a href="#" className="dropdown-item">Dropdown 1</a>
                    <a href="#" className="dropdown-item">Dropdown 2</a>
                  </div>
                </div>

                <Link to="/contact" className="nav-item nav-link">Contact Us</Link>
              </div>

              {/* RIGHT SECTION */}
              <div className="d-flex flex-nowrap border-top pt-3 pt-xl-0">

                {/* Search */}
                <button
                  className="btn-search btn border border-primary btn-md-square rounded-circle bg-white my-auto ms-3"
                  data-bs-toggle="modal"
                  data-bs-target="#searchModal"
                >
                  <i className="fas fa-search text-primary"></i>
                </button>

                {/* LOGIN / USER DROPDOWN */}
                {!user ? (
                  <Link to="/login" className="btn btn-primary ms-3 my-auto px-4 rounded-pill">
                    Login
                  </Link>
                ) : (
                  <div
                    className="ms-3 my-auto position-relative"
                  onClick={() => setShowDropdown(!showDropdown)}

                    style={{ cursor: "pointer" }}
                  >
                    <span className="fw-bold text-primary">{user?.username}</span>

                    {showDropdown && (
                      <div
                        className="position-absolute bg-white shadow rounded border mt-2 p-2"
                        style={{ right: 0, width: "180px", zIndex: 1000 }}
                      >
                        <Link to="/profile" className="dropdown-item p-2">
                          Profile
                        </Link>
                        <Link to="/quiz" className="dropdown-item p-2">
                          Quiz
                        </Link>
                        <Link to="/settings" className="dropdown-item p-2">
                          Settings
                        </Link>

                        <Link to="/add-note" className="dropdown-item p-2">
                          Notes
                        </Link>

                        <button className="dropdown-item p-2 text-danger" onClick={logoutUser}>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </nav>
        </div>
      </div>

    </div>
  );
};

export default Topbar;
