import { useState, lazy, Suspense } from 'react';
const RecentRecords = lazy(() => import('../../components/FacultyDasboard/Dashboard/RecentRecords'));
const TodayClasses = lazy(() => import('../../components/FacultyDasboard/Dashboard/TodayClasses'));
const QuickActions = lazy(() => import('../../components/FacultyDasboard/Dashboard/QuickActions'));
const Header = lazy(() => import('../../components/FacultyDasboard/Layout/Header'));
const Sidebar = lazy(() => import('../../components/FacultyDasboard/Layout/Sidebar'));

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = {
    name: 'Dr. Shrinath Tailor',
    department: 'Computer Science Department',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Header title="Faculty Dashboard" user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="pt-16 md:pt-20 md:ml-64 p-4 md:p-6">
          <QuickActions />
          <TodayClasses />
          <RecentRecords />
        </main>
      </Suspense>
    </div>
  );
}
