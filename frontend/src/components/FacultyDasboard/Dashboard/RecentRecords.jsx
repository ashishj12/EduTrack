import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "../../../context/authContext";

export default function RecentRecords() {
  const { getRecentAttendance } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentAttendance = async () => {
      try {
        setLoading(true);
        const response = await getRecentAttendance(5); 
        let attendanceData = [];
        if (response && Array.isArray(response)) {
          attendanceData = response;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.records)
        ) {
          attendanceData = response.data.records;
        } else if (
          response &&
          response.attendanceRecords &&
          Array.isArray(response.attendanceRecords)
        ) {
          attendanceData = response.attendanceRecords;
        } else if (response && Array.isArray(response.data)) {
          attendanceData = response.data;
        }
        setRecords(attendanceData);
      } catch (err) {
        console.error("Failed to fetch recent attendance:", err);
        setError("Failed to load recent records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAttendance();
  }, [getRecentAttendance]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getSubjectName = (subject) => {
    if (!subject) return "Unknown Subject";
    if (typeof subject === "object") {
      if (subject.subjectName) return subject.subjectName;
    }
    return "Subject Name Unavailable";
  };

  if (loading) {
    return (
      <div className="mt-8 md:mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Recent Attendance Records
        </h2>
        <div className="flex justify-center items-center py-10">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 md:mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Recent Attendance Records
        </h2>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="mt-8 md:mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Recent Attendance Records
        </h2>
        <p className="text-gray-600 text-center py-6">
          No attendance records found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-10 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Recent Attendance Records
      </h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record, index) => {
                // Calculate counts safely
                const totalStudents =
                  record.students?.length || record.totalStudents || 0;
                const presentCount =
                  record.students?.filter((s) => s.present).length ||
                  record.presentCount ||
                  0;
                  
                return (
                  <tr
                    key={record._id || index}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 text-sm">
                      {getSubjectName(record.subject)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      {totalStudents}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {totalStudents - presentCount} 
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          {presentCount} 
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}