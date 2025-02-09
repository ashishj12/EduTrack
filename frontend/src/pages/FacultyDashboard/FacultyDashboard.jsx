import RecentRecords from '../../components/FacultyDasboard/Dashboard/RecentRecords';
import TodayClasses from '../../components/FacultyDasboard/Dashboard/TodayClasses';
import QuickActions from '../../components/FacultyDasboard/Dashboard/QuickActions';
import Header from '../../components/FacultyDasboard/Layout/Header';
import Sidebar from '../../components/FacultyDasboard/Layout/Sidebar';


export default function Dashboard() {
  const user = {
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science Department',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Faculty Dashboard" user={user} />
      <main className="ml-64 p-6">
        <QuickActions />
        <TodayClasses />
        <RecentRecords />
        <Sidebar />
      </main> 
    </div>
  );
}