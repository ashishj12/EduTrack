import React, { useState } from "react"
import { Bell, Download, LogOut, User } from "lucide-react"
import html2pdf from "html2pdf.js"
import AttendanceCard from "../components/StudentDashboard/AttendanceCard"
import Calendar from "../components/StudentDashboard/Calendar"
import CorrectionRequestModal from "../components/StudentDashboard/CorrectionRequestModal"
import NotificationBar from "../components/StudentDashboard/NotificationBar"
import RecentClassCard from "../components/StudentDashboard/RecentClassCard"
import ScheduleCard from "../components/StudentDashboard/ScheduleCard"

const StudentDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const attendanceData = [
    { subject: "Data Structures", totalClasses: 45, present: 42, absent: 3, rate: 93 },
    { subject: "Computer Networks", totalClasses: 40, present: 35, absent: 5, rate: 87 },
    { subject: "Operating Systems", totalClasses: 42, present: 38, absent: 4, rate: 90 },
    { subject: "Database Management", totalClasses: 38, present: 35, absent: 3, rate: 92 },
  ]

  const recentClassesData = [
    { subject: "Data Structures", date: "2024-02-09", status: "present" },
    { subject: "Computer Networks", date: "2024-02-08", status: "absent" },
    { subject: "Operating Systems", date: "2024-02-07", status: "present" },
    { subject: "Database Management", date: "2024-02-06", status: "present" },
  ]

  const scheduleData = [
    { subject: "Data Structures", time: "09:00 AM", room: "Room 301", status: "Completed" },
    { subject: "Computer Networks", time: "11:00 AM", room: "Lab 201", status: "Ongoing" },
    { subject: "Operating Systems", time: "02:00 PM", room: "Room 405", status: "Upcoming" },
  ]

  const handleDownloadReport = () => {
    const element = document.getElementById("dashboard-content")
    const opt = {
      margin: 10,
      filename: "attendance-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <>
      <div className={`${isNotificationBarOpen ? "filter blur-sm" : ""}`}>
        <div id="dashboard-content" className="p-4 md:p-8 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Attendance Overview</h1>
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
                onClick={() => setIsNotificationBarOpen(!isNotificationBarOpen)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-gray-600">CSE · Semester 6</div>
                  </div>
                </div>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </a>
                    <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {attendanceData.map((data, index) => (
                  <AttendanceCard key={index} {...data} />
                ))}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Recent Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentClassesData.map((classData, index) => (
                    <RecentClassCard key={index} {...classData} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    Request Correction
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold p-6 pb-4">Today's Schedule</h2>
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

      <CorrectionRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <NotificationBar isOpen={isNotificationBarOpen} onClose={() => setIsNotificationBarOpen(false)} />
    </>
  )
}

export default StudentDashboard
