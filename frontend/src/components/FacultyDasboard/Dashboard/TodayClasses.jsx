import { Users, Clock } from 'lucide-react';

export default function TodayClasses() {
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

  return (
    <div className="mt-6 md:mt-8">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Today's Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {classes.map(classItem => (
          <div key={classItem.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold">{classItem.name}</h3>
                <p className="text-sm text-gray-500">{classItem.code}</p>
              </div>
              <span className="text-sm text-gray-500">{classItem.time}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{classItem.students} Students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{classItem.time}</span>
              </div>
            </div>

            {classItem.marked ? (
              <div className="text-green-600 text-sm font-medium">
                Attendance Marked • {classItem.present} / {classItem.students} Present
              </div>
            ) : (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Mark Attendance
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}