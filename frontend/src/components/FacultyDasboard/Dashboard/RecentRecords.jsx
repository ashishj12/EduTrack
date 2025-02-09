import { Eye, Pencil, Trash } from 'lucide-react';

export default function RecentRecords() {
  const records = [
    {
      id: 1,
      class: 'Computer Science 101',
      date: '2024-01-15',
      time: '09:00 AM',
      total: 45,
      present: 42,
      absent: 3
    },
    {
      id: 2,
      class: 'Data Structures',
      date: '2024-01-15',
      time: '11:00 AM',
      total: 38,
      present: 35,
      absent: 3
    },
    {
      id: 3,
      class: 'Algorithm Design',
      date: '2024-01-14',
      time: '02:00 PM',
      total: 40,
      present: 38,
      absent: 2
    },
    {
      id: 4,
      class: 'Database Systems',
      date: '2024-01-14',
      time: '04:00 PM',
      total: 35,
      present: 33,
      absent: 2
    }
  ];

  return (
    <div className="mt-6 md:mt-8">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Attendance Records</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 md:px-6 py-4 text-sm">{record.class}</td>
                <td className="px-4 md:px-6 py-4 text-sm">{record.date}</td>
                <td className="px-4 md:px-6 py-4 text-sm">{record.time}</td>
                <td className="px-4 md:px-6 py-4 text-sm">{record.total}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-green-600">{record.present}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-red-600">{record.absent}</td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600 transition-colors">
                      <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                      <Trash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}