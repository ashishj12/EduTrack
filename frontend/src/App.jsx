import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/HomePage/Navbar";
import Footer from "./components/HomePage/Footer";
import Home from "./pages/HomePage/Home";
import Features from "./components/HomePage/Features";
import Contact from "./pages/HomePage/Contact";
import About from "./pages/HomePage/About";
import Login from "./pages/HomePage/Login";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login/:loginType" element={<Login />} />{" "}
            {/* Route for login */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
