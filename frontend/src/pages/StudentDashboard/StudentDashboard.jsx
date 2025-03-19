import React, { useState, useEffect } from "react";
import { Download, LogOut, User } from "lucide-react";
import AttendanceCard from "../../components/StudentDashboard/AttendanceCard";
import Calendar from "../../components/StudentDashboard/Calendar";
import CorrectionRequestModal from "../../components/StudentDashboard/CorrectionRequestModal";
import ScheduleCard from "../../components/StudentDashboard/ScheduleCard";
import RecentClassCard from "../../components/StudentDashboard/RecentClassCard";
import { useAuth } from "../../context/authContext";

const StudentDashboard = () => {
  const { currentUser } = useAuth(); // Access the currentUser from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const openModal = () => {
    setIsBlurred(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsBlurred(false);
    setIsModalOpen(false);
  };

  const attendanceData = [
    { subject: "Data Structures", totalClasses: 45, present: 42, absent: 3, rate: 93 },
    { subject: "Computer Networks", totalClasses: 40, present: 35, absent: 5, rate: 87 },
    { subject: "Operating Systems", totalClasses: 42, present: 38, absent: 4, rate: 90 },
    { subject: "Database Management", totalClasses: 38, present: 35, absent: 3, rate: 92 },
  ];

  const recentClassesData = [
    { subject: "Data Structures", date: "2024-02-09", status: "present" },
    { subject: "Computer Networks", date: "2024-02-08", status: "absent" },
    { subject: "Operating Systems", date: "2024-02-07", status: "present" },
    { subject: "Database Management", date: "2024-02-06", status: "present" },
  ];

  const scheduleData = [
    { subject: "Data Structures", time: "09:00 AM", room: "Room 301", status: "Completed" },
    { subject: "Computer Networks", time: "11:00 AM", room: "Lab 201", status: "Ongoing" },
    { subject: "Operating Systems", time: "02:00 PM", room: "Room 405", status: "Upcoming" },
  ];

  return (
    <>
      <div className={isBlurred ? "filter blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <div id="dashboard-content" className="p-3 sm:p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Navbar section */}
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
                    <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </a>
                    <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {attendanceData.map((data, index) => (
                    <AttendanceCard key={index} {...data} />
                  ))}
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Recent Classes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {recentClassesData.map((classData, index) => (
                      <RecentClassCard key={index} {...classData} />
                    ))}
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