import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

const FacultyTable = () => {
  const [facultyData] = useState([
    { id: "F001", name: "John Smith", department: "Computer Science", status: "Active" },
    { id: "F002", name: "Sarah Johnson", department: "Mathematics", status: "Active" },
    { id: "F003", name: "Michael Brown", department: "Physics", status: "On Leave" },
    { id: "F004", name: "Emily Davis", department: "Chemistry", status: "Active" },
    { id: "F005", name: "David Wilson", department: "Biology", status: "Active" },
  ])

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold">Faculty List</h2>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
          Add New Faculty
        </button>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Name", "Department", "Status", "Actions"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facultyData.map((faculty) => (
              <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.id}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{faculty.name}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      faculty.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : faculty.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {faculty.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      aria-label="Edit faculty"
                      className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      aria-label="Delete faculty"
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
        <div className="text-xs sm:text-sm text-gray-500">Showing 1 to 5 of 45 entries</div>
        <div className="flex space-x-1">
          <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm bg-white text-gray-500 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm bg-blue-600 text-white">1</button>
          <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm bg-white text-gray-700">2</button>
          <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm bg-white text-gray-700">3</button>
          <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm bg-white text-gray-500 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default FacultyTable