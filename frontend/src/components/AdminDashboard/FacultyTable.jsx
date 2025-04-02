import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

const FacultyTable = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getAllFaculties } = useAuth();
  
  useEffect(() => {
    // Prevent duplicate fetches
    if (isInitialized) return;
    
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const response = await getAllFaculties();
        
        if (response && response.faculties) {
          setFaculties(response.faculties);
        } else {
          throw new Error("Invalid data format from server");
        }
      } catch (err) {
        console.error("Error fetching faculty data:", err);
        setError(err.message || "Failed to load faculty data");
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    
    fetchFacultyData();
  }, [getAllFaculties, isInitialized]);
  
  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold">Faculty List</h2>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading faculty data...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faculties.length > 0 ? (
                faculties.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {faculty.name || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {faculty.username || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {faculty.department || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {faculty.role || "Faculty"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                    No faculty data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyTable;