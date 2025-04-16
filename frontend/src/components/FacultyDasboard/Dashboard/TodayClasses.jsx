import React, { useState, useEffect } from 'react';
import { Users, X, BookOpen, Clock } from 'lucide-react';
import UploadImage from '../../../pages/FacultyDashboard/UploadImage';
import { useAuth } from '../../../context/authContext';

export default function TodayClasses() {
  const [uploadClassId, setUploadClassId] = useState(null);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { getAssignedSubjects } = useAuth();

  useEffect(() => {
    async function fetchAssignedSubjects() {
      try {
        setLoading(true);
        const response = await getAssignedSubjects();
        // More robust data extraction
        let subjectsData = [];
        if (Array.isArray(response)) {
          subjectsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          subjectsData = response.data;
        } else if (response && response.subjects && Array.isArray(response.subjects)) {
          subjectsData = response.subjects;
        }

        
        // Transform the API response to match  component's  format
        const formattedClasses = subjectsData.map((subject, index) => ({
          id: subject._id || subject.id || `class-${index + 1}`,
          name: subject.subjectName || subject.name || 'Unnamed Subject',
          time: getTimeSlot(index),
          students: 60,
          marked: false,
          semester: subject.subjectSem || subject.semester || 'N/A',
          department: subject.department || 'Computer Science',
          subjectId: subject._id || subject.id 
        }));        
        setAssignedClasses(formattedClasses);
        setError(null);
      } catch (err) {
        console.error("Error fetching assigned subjects:", err);
        setError("Failed to load today's classes");
        setAssignedClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignedSubjects();
  }, [getAssignedSubjects]);

  // time slots function
  const getTimeSlot = (index) => {
    const timeSlots = [
      '09:30 AM - 10:20 AM', 
      '10:20 AM - 11:10 PM', 
      '11:10 PM - 12:00 PM', 
      '12:00 PM - 12:50 PM',
    ];
    return timeSlots[index % timeSlots.length];
  };

  const handleMarkAttendance = (classId) => {
    setUploadClassId(classId);
  };

  const handleCloseUpload = () => {
    setUploadClassId(null);
  };

  // Debugging log
  useEffect(() => {
    console.log("Current Assigned Classes State:", assignedClasses);
  }, [assignedClasses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <div className="text-red-600 text-lg mb-2 font-medium">Unable to load classes</div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-10 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Today's Classes</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {assignedClasses.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-xl text-center">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-blue-700 mb-2">No Classes Scheduled</h3>
          <p className="text-blue-600">You don't have any classes assigned for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {assignedClasses.map(classItem => (
            <div 
              key={classItem.id} 
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 flex flex-col" >
              <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="text-xs font-medium text-blue-600 mb-1">
                  SEMESTER {classItem.semester}
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 h-12">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {classItem.department}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 mb-4 flex-grow">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {classItem.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {classItem.students} Students
                  </span>
                </div>
              </div>

              {classItem.marked ? (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                  <div className="text-green-600 text-sm font-medium">
                    Attendance Marked
                  </div>
                  <div className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {classItem.present} / {classItem.students}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleMarkAttendance(classItem.id)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center flex items-center justify-center gap-2" >
                  Mark Attendance
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attendance Upload Overlay */}
      {uploadClassId && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn overflow-y-auto p-4">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex justify-end p-2">
              <button 
                onClick={handleCloseUpload} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <UploadImage 
                onClose={handleCloseUpload} 
                selectedClass={assignedClasses.find(c => c.id === uploadClassId)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}