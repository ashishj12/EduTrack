import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllStudents } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await getAllStudents(); 
        // Handle different response formats
        if (Array.isArray(studentsData)) {
          setStudents(studentsData);
        } else if (studentsData && studentsData.students) {
          setStudents(studentsData.students);
        } else {
          setStudents([studentsData]);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch students. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, [getAllStudents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
      
      {Array.isArray(students) && students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student?._id || student?.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.username || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.branch || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.semester || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.batch || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No students found.</p>
        </div>
      )}
    </div>  
  );
};

export default StudentManagement;