import { useState } from 'react';
import RecentRecords from '../../components/FacultyDasboard/Dashboard/RecentRecords';
import TodayClasses from '../../components/FacultyDasboard/Dashboard/TodayClasses';
import QuickActions from '../../components/FacultyDasboard/Dashboard/QuickActions';
import Header from '../../components/FacultyDasboard/Layout/Header';
import Sidebar from '../../components/FacultyDasboard/Layout/Sidebar';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = {
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science Department',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header title="Faculty Dashboard" user={user} onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="pt-16 md:pt-20 md:ml-64 p-4 md:p-6">
        <QuickActions />
        <TodayClasses />
        <RecentRecords />
      </main>
    </div>
  );
}