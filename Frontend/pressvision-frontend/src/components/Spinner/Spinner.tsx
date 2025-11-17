// src/components/Spinner/Spinner.tsx
import React from "react";

const Spinner: React.FC = () => (
     <div>
            
            <div id="spinner" className="w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50  d-flex align-items-center justify-content-center">
                <div className="spinner-grow text-primary" role="status"></div>
            </div>

 </div>
);

export default Spinner;
