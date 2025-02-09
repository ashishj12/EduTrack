import { Bell, Settings } from 'lucide-react';

export default function Header({ title, user }) {
  return (
    <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}