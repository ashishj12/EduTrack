import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import Features from "./components/HomePage/Features";
import Contact from "./pages/HomePage/Contact";
import About from "./pages/HomePage/About";
import Login from "./pages/HomePage/Login";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import Layout from "./components/common/Layout";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* <Navbar /> */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/features" element={<Layout><Features /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login/:loginType" element={<Login />} />{" "}
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            {/* Route for login */}
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;