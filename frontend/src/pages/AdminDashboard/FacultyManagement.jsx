import FacultyTable from "../../components/AdminDashboard/FacultyTable";

const FacultyManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
        <p className="text-gray-500">
          Manage faculty members and their information
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FacultyTable />
      </div>
    </div>
  );
};

export default FacultyManagement;
