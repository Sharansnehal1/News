import React from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./components/Topbar/Topbar";
import Login from "./components/Auth/Login";
import Articles from "./components/Articles/Articles";
import Footer from "./components/Footer/Footer";
import Spinner from "./components/Spinner/Spinner";
import Contact from "./components/Articles/Contact";

const App: React.FC = () => {
  return (
    <div>
      {/* Global Spinner */}
      <Spinner />

      {/* Topbar visible on all pages */}
      <Topbar />

      {/* Page Routes */}
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Articles />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Footer visible on all pages */}
      <Footer />
    </div>
  );
};

export default App;
