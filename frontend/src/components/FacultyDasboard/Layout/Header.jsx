import { LogOut } from 'lucide-react';
import { useAuth } from '../../../context/authContext';

export default function Header({ title }) {
  const { currentUser, logout } = useAuth();

  // Function to generate avatar from name
  const getInitials = (name) => {
    if (!name) return 'FD';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Improved logout handler
  const handleLogout = () => {

    // Prevent browser navigation after logout
    window.history.pushState(null, "", "/login");

    // Add event listener to prevent back navigation
    const preventBackNavigation = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", "/login");
    };
    
    window.addEventListener('popstate', preventBackNavigation);
    logout();

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  };

  return (
    <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 z-10 shadow-md transition-all duration-300 ease-in-out">
      <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {getInitials(currentUser?.name)}
          </div>
          <div className="hidden md:block ml-2">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.department}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:bg-red-50 rounded-full transition-colors" >
          <LogOut className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
        </button>
      </div>
    </header>
  );
}