import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Attendance Records</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4">{record.class}</td>
                <td className="px-6 py-4">{record.date}</td>
                <td className="px-6 py-4">{record.time}</td>
                <td className="px-6 py-4">{record.total}</td>
                <td className="px-6 py-4">{record.present}</td>
                <td className="px-6 py-4">{record.absent}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <TrashIcon className="w-5 h-5" />
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
