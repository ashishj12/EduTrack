import {  lazy, Suspense } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '../../context/authContext';

// Lazy loaded components
const TodayClasses = lazy(() => import('../../components/FacultyDasboard/Dashboard/TodayClasses'));
const QuickActions = lazy(() => import('../../components/FacultyDasboard/Dashboard/QuickActions'));
const Header = lazy(() => import('../../components/FacultyDasboard/Layout/Header'));
const RecentRecords = lazy(() => import('../../components/FacultyDasboard/Dashboard/RecentRecords'));

export default function Dashboard() {
  const { currentUser } = useAuth();

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
        <Header title="Faculty Dashboard" user={currentUser} />
        <main className="pt-20 p-4 md:p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto space-y-8">
            <QuickActions />
            <TodayClasses />
            <RecentRecords />
          </div>
        </main>
      </Suspense>
    </div>
  );
}