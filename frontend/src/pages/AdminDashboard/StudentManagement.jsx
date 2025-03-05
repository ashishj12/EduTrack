const StudentManagement = () => {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
          Student Management
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm sm:text-base">
          Add New Student
        </button>
      </div>
    </div>
  );
};

export default StudentManagement;
