import { useState, lazy, Suspense } from 'react';
import { Loader } from 'lucide-react';

// Lazy loaded components
const RecentRecords = lazy(() => import('../../components/FacultyDasboard/Dashboard/RecentRecords'));
const TodayClasses = lazy(() => import('../../components/FacultyDasboard/Dashboard/TodayClasses'));
const QuickActions = lazy(() => import('../../components/FacultyDasboard/Dashboard/QuickActions'));
const Header = lazy(() => import('../../components/FacultyDasboard/Layout/Header'));
const Sidebar = lazy(() => import('../../components/FacultyDasboard/Layout/Sidebar'));

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = {
    name: 'Dr. Shrinath Tailor',
    department: 'Computer Science Department',
    avatar: 'https://ui-avatars.com/api/?name=Shrinath+Tailor&background=random&color=fff'
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Header 
          title="Faculty Dashboard" 
          user={user} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <main className="pt-16 md:pt-20 md:ml-64 p-4 md:p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <QuickActions />
            <TodayClasses />
            <RecentRecords />
          </div>
        </main>
      </Suspense>
    </div>
  );
}