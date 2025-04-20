import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Calendar, Check, X, AlertCircle, Filter } from "lucide-react";

const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status.toLowerCase()) {
    case "approved":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <Check className="w-4 h-4 mr-1" />;
      break;
    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <X className="w-4 h-4 mr-1" />;
      break;
    case "pending":
    default:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
  }
  
  return (
    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AttendanceRecords = () => {
  const { currentUser, getStudentAttendance } = useAuth();
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    timeFrame: "all"
  });
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    stats: {
      total: 0,
      present: 0,
      absent: 0,
      percentage: 0
    }
  });

  // Fetch both attendance data and correction requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch attendance data
        const attendanceResponse = await getStudentAttendance();
        if (attendanceResponse) {
          setAttendanceData({
            records: attendanceResponse.data?.attendanceRecords || [],
            stats: {
              total: attendanceResponse.data?.statistics?.overall?.totalClasses || 0,
              present: attendanceResponse.data?.statistics?.overall?.attendedClasses || 0,
              absent: 
                (attendanceResponse.data?.statistics?.overall?.totalClasses || 0) - 
                (attendanceResponse.data?.statistics?.overall?.attendedClasses || 0),
              percentage: attendanceResponse.data?.statistics?.overall?.percentage || 0
            }
          });
        }
        
        // Fetch correction requests - will implement this endpoint in the backend
        // For now, let's use mock data
        const mockCorrections = [
          {
            _id: "corr1",
            subject: { subjectName: "Data Structures" },
            date: "2025-04-15",
            reason: "Marked Absent but Present",
            details: "I was present in class but was marked absent due to a technical error.",
            status: "pending",
            createdAt: "2025-04-16T10:30:00Z"
          },
          {
            _id: "corr2",
            subject: { subjectName: "Computer Networks" },
            date: "2025-04-10",
            reason: "Technical Issue",
            details: "The facial recognition system failed to recognize me.",
            status: "approved",
            createdAt: "2025-04-11T09:15:00Z"
          }
        ];
        
        setCorrections(mockCorrections);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [getStudentAttendance]);

  // Filter correction requests
  const filteredCorrections = corrections.filter(correction => {
    // Filter by status
    if (filters.status !== "all" && correction.status !== filters.status) {
      return false;
    }
    
    // Filter by time frame
    if (filters.timeFrame !== "all") {
      const createdDate = new Date(correction.createdAt);
      const now = new Date();
      
      switch (filters.timeFrame) {
        case "week":
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return createdDate >= weekAgo;
        case "month":
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return createdDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-500">View your attendance details and correction requests</p>
      </div>

      {/* Attendance Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Classes</p>
            <p className="text-2xl font-bold text-gray-800">{attendanceData.stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Classes Attended</p>
            <p className="text-2xl font-bold text-green-600">{attendanceData.stats.present}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Classes Missed</p>
            <p className="text-2xl font-bold text-red-600">{attendanceData.stats.absent}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Attendance Rate</p>
            <p className="text-2xl font-bold text-purple-600">{attendanceData.stats.percentage}%</p>
          </div>
        </div>
      </div>

      {/* Correction Requests Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Correction Requests</h2>
          
          {/* Filters */}
          <div className="flex items-center space-x-2 text-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">Filter by:</span>
            <select 
              className="border rounded-md px-2 py-1 text-gray-600 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select 
              className="border rounded-md px-2 py-1 text-gray-600 text-sm"
              value={filters.timeFrame}
              onChange={(e) => setFilters({...filters, timeFrame: e.target.value})}
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>
        
        {filteredCorrections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCorrections.map((correction) => (
                  <tr key={correction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {correction.subject.subjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {formatDate(correction.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {correction.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={correction.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(correction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No correction requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;