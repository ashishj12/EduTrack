import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Lazy load components to optimize loading times
const Home = lazy(() => import("./pages/HomePage/Home"));
const Features = lazy(() => import("./components/HomePage/Features"));
const Contact = lazy(() => import("./pages/HomePage/Contact"));
const About = lazy(() => import("./pages/HomePage/About"));
const Login = lazy(() => import("./pages/HomePage/Login"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard/StudentDashboard"));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard/FacultyDashboard"));
const Layout = lazy(() => import("./components/common/Layout"));

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Layout container for pages */}
        <main className="flex-grow">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/features" element={<Layout><Features /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/login/:loginType" element={<Login />} />
              <Route path="/studentdashboard" element={<StudentDashboard />} />
              <Route path="/facultydashboard" element={<FacultyDashboard />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
