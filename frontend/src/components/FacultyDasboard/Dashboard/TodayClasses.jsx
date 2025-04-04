import { useState } from 'react';
import { Users, X } from 'lucide-react';
import UploadImage from '../../../pages/FacultyDashboard/UploadImage';

export default function TodayClasses() {
  const [uploadClassId, setUploadClassId] = useState(null);

  const classes = [
    {
      id: 1,
      name: 'Computer Science 101',
      code: 'CS101',
      time: '09:00 AM',
      students: 45,
      marked: true,
      present: 42
    },
    {
      id: 2,
      name: 'Data Structures',
      code: 'CS201',
      time: '11:00 AM',
      students: 38,
      marked: true,
      present: 35
    },
    {
      id: 3,
      name: 'Algorithm Design',
      code: 'CS301',
      time: '02:00 PM',
      students: 40,
      marked: false
    },
    {
      id: 4,
      name: 'Database Systems',
      code: 'CS401',
      time: '04:00 PM',
      students: 35,
      marked: false
    }
  ];

  const handleMarkAttendance = (classId) => {
    setUploadClassId(classId);
  };

  const handleCloseUpload = () => {
    setUploadClassId(null);
  };

  return (
    <div className="mt-8 md:mt-10 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Today's Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {classes.map(classItem => (
          <div 
            key={classItem.id} 
            className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold">{classItem.name}</h3>
                <p className="text-sm text-gray-500">{classItem.code}</p>
              </div>
              <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{classItem.time}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{classItem.students} Students</span>
              </div>
            </div>

            {classItem.marked ? (
              <div className="flex items-center justify-between">
                <div className="text-green-600 text-sm font-medium">
                  Attendance Marked
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  {classItem.present} / {classItem.students}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleMarkAttendance(classItem.id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Mark Attendance
              </button>
            )}
          </div>
        ))}
      </div>

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
                selectedClass={classes.find(c => c.id === uploadClassId)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}