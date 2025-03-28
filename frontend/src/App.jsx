import { Suspense, lazy } from "react";
import {  BrowserRouter as Router,  Route,  Routes,  Navigate} from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./services/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

// Fallback loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load components to optimize loading times
const Home = lazy(() => import("./pages/HomePage/Home"));
const Contact = lazy(() => import("./pages/HomePage/Contact"));
const Login = lazy(() => import("./pages/HomePage/Login"));
const StudentDashboard = lazy(() =>
  import("./pages/StudentDashboard/StudentDashboard")
);
const FacultyDashboard = lazy(() =>
  import("./pages/FacultyDashboard/FacultyDashboard")
);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/Dashboard"));
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
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login/:loginType" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/student-dashboard/*"
                  element={
                    <ProtectedRoute requiredRole="Student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty-dashboard/*"
                  element={
                    <ProtectedRoute requiredRole="Faculty">
                      <FacultyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard/*"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<AdminLogin />} />
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
