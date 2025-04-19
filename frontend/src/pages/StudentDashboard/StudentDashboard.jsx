import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Download, LogOut } from "lucide-react";
import Calendar from "../../components/StudentDashboard/Calendar";
import CorrectionRequestModal from "../../components/StudentDashboard/CorrectionRequestModal";
import ScheduleCard from "../../components/StudentDashboard/ScheduleCard";
import RecentClassCard from "../../components/StudentDashboard/RecentClassCard";
import { useAuth } from "../../context/authContext";

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "your-spreadsheet-id-here";
console.log("Spreadsheet ID:", SPREADSHEET_ID);

// Circular progress component to show attendance percentage
const CircularProgress = ({ percentage }) => {
  const validPercentage = isNaN(percentage) ? 0 : Math.min(Math.max(0, percentage), 100);
  const radius = 30; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <svg
        className="w-full h-full transform -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40" />
        <circle
          className="text-green-500"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-semibold">
        {validPercentage.toFixed(0)}%
      </span>
    </div>
  );
};

// AttendanceCard component to display attendance details
const AttendanceCard = ({ subject, totalClasses, present, absent, rate, onClick }) => {
  const safeRate = isNaN(rate) ? 0 : Math.min(Math.max(0, rate), 100);
  const safeTotal = totalClasses || 0;
  const safePresent = present || 0;
  const safeAbsent = absent || 0;

  const displaySubject = subject && subject.length > 25 
    ? `${subject.substring(0, 22)}...` 
    : subject || "Unknown Subject";

  return (
    <div 
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick} 
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 truncate">
        {displaySubject}
      </h3>
      <div className="flex justify-between items-center">
        <div className="space-y-1 sm:space-y-2 flex-1 mr-2">
          <div className="text-xs sm:text-sm">
            <span className="text-gray-600">Total Classes: </span>
            <span className="font-medium">{safeTotal}</span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-green-600 font-medium">
              Present: {safePresent}
            </span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-red-500 font-medium">Absent: {safeAbsent}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <CircularProgress percentage={safeRate} />
        </div>
      </div>
    </div>
  );
};

// StudentDashboard component
const StudentDashboard = () => {
  const { currentUser, logout, getStudentAttendance } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [recentClassesData, setRecentClassesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState({
    attendance: true,
    recentClasses: true
  });
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAttendanceData = useCallback(async () => {
    setSectionLoading(prev => ({ ...prev, attendance: true, recentClasses: true }));
    try {
      const cachedData = sessionStorage.getItem('attendanceData');
      const cacheTimestamp = sessionStorage.getItem('attendanceDataTimestamp');
      const now = Date.now();

      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) {
        const parsedData = JSON.parse(cachedData);
        setAttendanceData(parsedData.subjectWiseData);
        setRecentClassesData(parsedData.recentClasses);
        setSectionLoading({
          attendance: false,
          recentClasses: false
        });
        setIsLoading(false);
        return;
      }

      const response = await getStudentAttendance();
      if (response && response.data) {
        const subjectWiseData = Array.isArray(response.data.statistics?.subjectWise) 
          ? response.data.statistics.subjectWise.map(subject => ({
              subject: subject.subject?.subjectName || "Unknown Subject",
              totalClasses: parseInt(subject.totalClasses) || 0,
              present: parseInt(subject.attendedClasses) || 0,
              absent: (parseInt(subject.totalClasses) || 0) - (parseInt(subject.attendedClasses) || 0),
              rate: parseFloat(subject.percentage) || 0
            }))
          : [];
        
        setAttendanceData(subjectWiseData);
        
        const recentClasses = Array.isArray(response.data.attendanceRecords)
          ? response.data.attendanceRecords
              .slice(0, 4) 
              .map(record => ({
                subject: record.subject?.subjectName || "Unknown Subject",
                date: record.date,
                status: record.present ? "present" : "absent"
              }))
          : [];
          
        setRecentClassesData(recentClasses);
        
        sessionStorage.setItem('attendanceData', JSON.stringify({
          subjectWiseData,
          recentClasses
        }));
        sessionStorage.setItem('attendanceDataTimestamp', now.toString());
        
        setSectionLoading({
          attendance: false,
          recentClasses: false
        });
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Failed to load attendance data. Please try again later.");
      setSectionLoading({
        attendance: false,
        recentClasses: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [getStudentAttendance]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        await fetchAttendanceData();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to load attendance data:", err);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [fetchAttendanceData, retryCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const scheduleData = useMemo(() => [
    { subject: "Big Data Analytics", time: "09:30 AM"},
    { subject: "Disaster Management", time: "10:20 AM"},
    { subject: "Project", time: "11:10 PM"},
  ], []);

  const handleLogout = () => {
    window.history.pushState(null, "", "/login");
    logout();
  };

  const openModal = () => {
    setIsBlurred(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsBlurred(false);
    setIsModalOpen(false);
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setIsLoading(true);
  };

  // Function to open the student attendance sheet
  const openAttendanceSheet = async (subjectName) => {
    try {
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0&range=${subjectName}`;
      window.open(sheetUrl, '_blank');
    } catch (error) {
      console.error("Error opening attendance sheet:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={isBlurred ? "filter blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <div id="dashboard-content" className="p-3 sm:p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-row justify-between items-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Attendance Overview</h1>
              <div className="relative profile-dropdown-container">
                <div
                  className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
                    {currentUser && currentUser.name ? currentUser.name[0] : "U"}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-sm sm:text-base">{currentUser?.name || "Unknown"}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {currentUser?.branch} · Semester {currentUser?.semester}
                    </div>
                  </div>
                </div>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-100">
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p>{error}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {sectionLoading.attendance ? (
                    [...Array(4)].map((_, index) => (
                      <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="space-y-2 w-1/2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </div>
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200"></div>
                        </div>
                      </div>
                    ))
                  ) : attendanceData.length > 0 ? (
                    attendanceData.map((data, index) => {
                      return (
                        <AttendanceCard 
                          key={index} 
                          {...data} 
                          onClick={() => openAttendanceSheet(data.subject)} 
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow-md text-center">
                      <p className="text-gray-500">No attendance data available</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Recent Classes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {sectionLoading.recentClasses ? (
                      [...Array(4)].map((_, index) => (
                        <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg animate-pulse">
                          <div className="flex justify-between items-center">
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                        </div>
                      ))
                    ) : recentClassesData.length > 0 ? (
                      recentClassesData.map((classData, index) => (
                        <RecentClassCard key={index} {...classData} />
                      ))
                    ) : (
                      <div className="col-span-2 bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500">No recent classes found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={openModal}
                      className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Request Correction
                    </button>
                    <button
                      onClick={() => openAttendanceSheet(currentUser._id)}
                      className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-base sm:text-lg font-semibold p-4 sm:p-6 pb-2 sm:pb-4 text-gray-800">Today's Schedule</h2>
                  <div>
                    {scheduleData.map((schedule, index) => (
                      <ScheduleCard key={index} {...schedule} />
                    ))}
                  </div>
                </div>

                <Calendar month={new Date().getMonth()} year={new Date().getFullYear()} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CorrectionRequestModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default StudentDashboard;