import { CameraIcon, EyeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <CameraIcon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
        <p className="text-gray-600 mb-4">Take attendance using image recognition</p>
        <button className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg">
          Upload Image
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <EyeIcon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">View Records</h3>
        <p className="text-gray-600 mb-4">Check previous attendance records</p>
        <button className="text-green-600 font-medium hover:bg-green-50 px-4 py-2 rounded-lg">
          View All
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <AcademicCapIcon className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Manage Classes</h3>
        <p className="text-gray-600 mb-4">Update class information and settings</p>
        <button className="text-purple-600 font-medium hover:bg-purple-50 px-4 py-2 rounded-lg">
          Manage
        </button>
      </div>
    </div>
  );
}
