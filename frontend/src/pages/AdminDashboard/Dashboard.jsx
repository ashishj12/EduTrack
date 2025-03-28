import React, { useState } from "react";
import { Users, GraduationCap, ClipboardCheck, FileText, Plus, UserPlus } from "lucide-react";
import ActionCard from "../../components/AdminDashboard/ActionCard";
import TabNavigation from "../../components/AdminDashboard/TabNavigation";
import FacultyTable from "../../components/AdminDashboard/FacultyTable";
import Header from "../../components/AdminDashboard/Header";
import StudentManagement from "./StudentManagement";
import StudentRegistrationForm from "./StudentRegistrationForm";
import FacultyAssignmentForm from "./FacultyAssignmentForm";
import AssignSubject from "./AssignSubject"; // Ensure this import is correct

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("faculty");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "Admin" });
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // States to control opening of various forms
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [isFacultyAssignmentFormOpen, setIsFacultyAssignmentFormOpen] = useState(false);
  const [isAssignSubjectFormOpen, setIsAssignSubjectFormOpen] = useState(false);

  const stats = [
    {
      id: 1,
      title: "Total Faculty",
      value: "45",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Total Students",
      value: "1,250",
      icon: <GraduationCap className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: "Today's Attendance",
      value: "92%",
      icon: <ClipboardCheck className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  const actions = [
    {
      id: 1,
      title: "Add Faculty",
      description: "Register new faculty member",
      icon: <Plus className="w-6 h-6 text-white" />,
      bgColor: "bg-blue-100",
      iconBgColor: "bg-blue-500",
      onClick: () => setIsFacultyAssignmentFormOpen(true),
    },
    {
      id: 2,
      title: "Add Student",
      description: "Register new student",
      icon: <UserPlus className="w-6 h-6 text-white" />,
      bgColor: "bg-green-100",
      iconBgColor: "bg-green-500",
      onClick: () => setIsStudentFormOpen(true),
    },
    {
      id: 3,
      title: "Mark Attendance",
      description: "Record today's attendance",
      icon: <ClipboardCheck className="w-6 h-6 text-white" />,
      bgColor: "bg-purple-100",
      iconBgColor: "bg-purple-500",
      onClick: () => {}, // Add a no-op function to ensure onClick is consistent
    },
    {
      id: 4,
      title: "Assign Subject",
      description: "Assign Subject to Faculty",
      icon: <FileText className="w-6 h-6 text-white" />,
      bgColor: "bg-orange-100",
      iconBgColor: "bg-orange-500",
      onClick: () => setIsAssignSubjectFormOpen(true), // Explicitly set the state to true
    },
  ];

  const tabs = [
    { id: "faculty", label: "Faculty Management" },
    { id: "students", label: "Student Management" },
    { id: "attendance", label: "Attendance Records" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="min-h-screen w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 space-y-4 md:space-y-6">
      <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />

      {/* Welcome Section */}
      <div className="px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Welcome back, {user.name}</h1>
        <p className="text-sm sm:text-base text-gray-500">{formattedDate}</p>
      </div>

      {/* Quick Actions Section */}
      <div className="px-2 sm:px-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {actions.map((action) => (
            <ActionCard 
              key={action.id} 
              action={action} 
              onClick={action.onClick} // Ensure onClick is passed correctly
            />
          ))}
        </div>
      </div>

      {/* Tabs and Content Section */}
      <div className="bg-white rounded-lg shadow-sm mx-2 sm:mx-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="overflow-x-auto"
        />
        <div className="p-2 sm:p-4">
          {activeTab === "faculty" && <FacultyTable />}
          {activeTab === "students" && <StudentManagement />}
          {activeTab === "attendance" && <div>Attendance Records Content</div>}
          {activeTab === "reports" && <div>Reports Content</div>}
        </div>
      </div>

      {/* Student Registration Form */}
      {isStudentFormOpen && (
        <StudentRegistrationForm
          isOpen={isStudentFormOpen}
          onClose={() => setIsStudentFormOpen(false)}
          onSubmit={(studentData) => {
            console.log("New student data:", studentData);
            setIsStudentFormOpen(false); // Close form after submission
          }}
        />
      )}

      {/* Faculty Assignment Form */}
      {isFacultyAssignmentFormOpen && (
        <FacultyAssignmentForm
          isOpen={isFacultyAssignmentFormOpen}
          onClose={() => setIsFacultyAssignmentFormOpen(false)}
          onSubmit={(facultyData) => {
            console.log("New faculty data:", facultyData);
            setIsFacultyAssignmentFormOpen(false); // Close form after submission
          }}
        />
      )}

      {/* Assign Subject Form - Ensure this is correctly placed */}
      {isAssignSubjectFormOpen && (
        <AssignSubject
          isOpen={isAssignSubjectFormOpen}
          onClose={() => setIsAssignSubjectFormOpen(false)}
          onSubmit={(subjectData) => {
            console.log("New subject data:", subjectData);
            setIsAssignSubjectFormOpen(false); // Close form after submission
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;