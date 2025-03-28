export default function RecentRecords() {
  const records = [
    {
      id: 1,
      class: 'Computer Science 101',
      date: '2024-01-15',
      total: 45,
      present: 42,
      absent: 3
    },
    {
      id: 2,
      class: 'Data Structures',
      date: '2024-01-15',
      total: 38,
      present: 35,
      absent: 3
    },
    {
      id: 3,
      class: 'Algorithm Design',
      date: '2024-01-14',
      total: 40,
      present: 38,
      absent: 2
    },
    {
      id: 4,
      class: 'Database Systems',
      date: '2024-01-14',
      total: 35,
      present: 33,
      absent: 2
    }
  ];

  return (
    <div className="mt-8 md:mt-10 animate-fadeIn">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Attendance Records</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-sm">{record.class}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{record.total}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {record.present}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {record.absent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}