import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Using useNavigate hook for navigation

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm px-6 sm:px-12 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            EduTrack
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <button onClick={() => navigate("/")} className="text-secondary hover:text-primary cursor-pointer">
            Home
          </button>
          <button onClick={() => navigate("/features")} className="text-secondary hover:text-primary cursor-pointer">
            Features
          </button>
          <button onClick={() => navigate("/about")} className="text-secondary hover:text-primary cursor-pointer">
            About
          </button>
          <button onClick={() => navigate("/contact")} className="text-secondary hover:text-primary cursor-pointer">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
