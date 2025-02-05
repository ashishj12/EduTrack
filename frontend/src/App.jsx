import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

// Importing Components
import Features from './components/Features';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from "./pages/About";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "features":
        return <Features />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onNavigate={setCurrentPage} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer />
    </div>
  );
};

export default App;
