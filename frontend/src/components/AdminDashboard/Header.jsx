import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleLogout = () => {

    // Clear user data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/admin"); 
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/admin-dashboard" className="flex items-center">
              <span className="text-2xl sm:text-3xl font-bold text-primary">EduTrack</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Right: Notifications, User Menu, and Logout Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 text-gray-500 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6" />
            </button>
            <button 
              className="text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-1"
              aria-label="Logout"
              onClick={handleLogout} // Add the logout handler here
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b">
            <div className="px-4 py-4 space-y-2">
              <button 
                className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-100"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={handleLogout} // Add the logout handler here
                className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                aria-label="Logout" 
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
