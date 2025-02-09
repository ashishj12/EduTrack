import { UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map(classItem => (
          <div key={classItem.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
                <p className="text-sm text-gray-500">{classItem.code}</p>
              </div>
              <span className="text-gray-500">{classItem.time}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{classItem.students} Students</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{classItem.time}</span>
              </div>
            </div>

            {classItem.marked ? (
              <div className="text-green-600 text-sm font-medium">
                Attendance Marked • {classItem.present} / {classItem.students} Present
              </div>
            ) : (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Mark Attendance
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
