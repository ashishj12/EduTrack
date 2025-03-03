import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./services/ProtectedRoute";

// Fallback loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

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
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          {/* Layout container for pages */}
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/features" element={<Layout><Features /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/:loginType" element={<Login />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/studentdashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="Student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/facultydashboard/*" 
                  element={
                    <ProtectedRoute requiredRole="Faculty">
                      <FacultyDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;