import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const { loginType } = useParams();
  const [currentLoginType, setCurrentLoginType] = useState("Student" && "Faculty");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginFaculty } = useAuth(); // Use the login function from context
  const navigate = useNavigate();

  useEffect(() => {
    if (loginType) {
      setCurrentLoginType(loginType);
    }
  }, [loginType]);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        // Perform login based on currentLoginType
        let user;
        if (currentLoginType === "faculty") {
          user = await loginFaculty(username, password);
        } else {
          user = await login(username, password);
        }
        // Add a small delay to ensure storage is complete
        setTimeout(() => {
          // Redirect based on user role
          if (user.role === "Student") {
            navigate("/student-dashboard");
          } else if (user.role === "Faculty") {
            navigate("/faculty-dashboard");
          } else {
            navigate("/"); // Fallback redirect
          }
        }, 100);
      } catch (err) {
        console.error("Login error:", err);
        setError(err.message || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    },
    [username, password, navigate, login, loginFaculty, currentLoginType]
  );

  const handleToggleLoginType = useCallback(
    (type) => {
      setCurrentLoginType(type);
      navigate(`/login/${type}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left Section - Image */}
        <div className="relative">
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1738773901~exp=1738777501~hmac=decb05aa76af5cbdf8880e1c49ec1d1717efc7f7767f3ff3bc0c96dc8cdea8d6&w=740"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome,{" "}
              {currentLoginType.charAt(0).toUpperCase() +
                currentLoginType.slice(1)}
            </h1>
            <div className="flex justify-center space-x-4">
              {["Student", "faculty"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleToggleLoginType(type)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentLoginType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Login
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {currentLoginType === "Student" ? "Student ID" : "Faculty ID"}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter your ${
                  currentLoginType === "Student" ? "Student ID" : "Faculty ID"
                }`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Username or ID"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <a href="#" className="hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
