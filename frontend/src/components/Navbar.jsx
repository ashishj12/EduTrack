import React from "react";

const Navbar = ({ onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm px-6 sm:px-12 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          {/* <img 
            src="/path/to/logo.png" 
            alt="EduTrack Logo" 
            className="w-10 h-10" 
          /> */}
          <div className="text-2xl font-bold text-primary cursor-pointer"onClick={() => onNavigate("home")} >EduTrack</div>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <button
            onClick={() => onNavigate("home")}
            className="text-secondary hover:text-primary cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("features")}
            className="text-secondary hover:text-primary cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate("about")}
            className="text-secondary hover:text-primary cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="text-secondary hover:text-primary cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
