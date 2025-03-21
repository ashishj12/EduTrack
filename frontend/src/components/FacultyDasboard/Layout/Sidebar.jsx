import { Link } from 'react-router-dom';
import { Home, FileBarChart, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const sidebarClasses = `
    w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-20
    transform transition-transform duration-300 ease-in-out shadow-md
    md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileBarChart, label: 'Reports', path: '/reports' }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <h1 className="px-2 py-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">EduTrack</h1>
              </div>
              <button 
                onClick={onClose}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.path} 
                  className="flex items-center gap-2 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 font-medium"
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}