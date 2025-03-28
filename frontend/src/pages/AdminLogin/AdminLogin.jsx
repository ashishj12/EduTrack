import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import { useAuth } from "../../context/authContext";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    secretKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { username, password, secretKey } = formData;

    // Validate that secretKey is not empty
    if (!secretKey) {
      setError("Secret key is required");
      setLoading(false);
      return;
    }

    try {
      await loginAdmin(username, password, secretKey);
      
      // Navigate to admin dashboard on successful login
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 rounded-full p-3 inline-flex">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="secretKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Secret Key
              </label>
              <input
                type="text"
                id="secretKey"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the secret key"
                required
              />
              <div className="mt-2 flex items-start p-3 bg-gray-50 rounded-md">
                <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  The secret key is required and will be provided by your system
                  administrator
                </p>
              </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;