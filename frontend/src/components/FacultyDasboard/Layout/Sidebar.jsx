import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-blue-600 text-2xl">📚</span>
          <h1 className="text-xl font-bold">EduTrack</h1>
        </div>
        
        <nav className="space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-50 rounded-lg">
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/students" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-50 rounded-lg">
            <UserGroupIcon className="w-5 h-5" />
            <span>Students</span>
          </Link>
          
          <Link to="/reports" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-50 rounded-lg">
            <DocumentChartBarIcon className="w-5 h-5" />
            <span>Reports</span>
          </Link>
        </nav>
      </div>

      <button 
        className="absolute top-4 left-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Hamburger Icon */}
        <div className="w-8 h-8 flex flex-col justify-between items-center">
          <span className="block h-1 w-6 bg-gray-800"></span>
          <span className="block h-1 w-6 bg-gray-800"></span>
          <span className="block h-1 w-6 bg-gray-800"></span>
        </div>
      </button>
    </div>
  );
}
