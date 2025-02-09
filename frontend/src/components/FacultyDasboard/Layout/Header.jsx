import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Header({ title, user }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <BellIcon className="w-6 h-6" />
        </button>
        
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
