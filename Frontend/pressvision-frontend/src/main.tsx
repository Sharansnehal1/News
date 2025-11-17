// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'



// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import Owl Carousel CSS
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Import Bootstrap JS and dependencies
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import jQuery (needed for Owl Carousel)
import $ from "jquery";

// Import Owl Carousel JS
import "owl.carousel";
import { BrowserRouter } from "react-router-dom";



// Optional: attach jQuery to window if some plugins need it globally
// (only if your main.js depends on $ globally)
(window as any).$ = $;
(window as any).jQuery = $;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
   <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
