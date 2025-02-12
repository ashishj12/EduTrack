import { Link } from 'react-router-dom';
import { Home, Users, FileBarChart, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const sidebarClasses = `
    w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-20
    transform transition-transform duration-300 ease-in-out
    md:transform-none
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {/* <span className="text-blue-600 text-2xl"></span> */}
              <h1 className="px-2 py-2 text-3xl font-bold text-primary">EduTrack</h1>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => onClose()}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          
            
            <Link 
              to="/reports" 
              className="flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => onClose()}
            >
              <FileBarChart className="w-5 h-5" />
              <span>Reports</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}