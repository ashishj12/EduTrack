import { Camera, Eye, GraduationCap } from 'lucide-react';
import { lazy, useState } from 'react';
const FileUpload = lazy(() => import('../../common/File-Upload'));

export default function QuickActions() {
  const [fileUpload, setFileUpload] = useState(false);

  const handleFileUpload = () => {
    // Toggle the visibility of the file upload component
    setFileUpload(!fileUpload);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Take attendance using image recognition</p>
          <button
            onClick={handleFileUpload}
            className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
          >
            Upload Image
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">View Records</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Check previous attendance records</p>
          <button className="text-green-600 font-medium hover:bg-green-50 px-4 py-2 rounded-lg transition-colors w-full md:w-auto">
            View All
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Manage Classes</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Update class information and settings</p>
          <button className="text-purple-600 font-medium hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors w-full md:w-auto">
            Manage
          </button>
        </div>
      </div>

      {/* File Upload Overlay */}
      {fileUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="relative w-full max-w-lg mx-4 p-8 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
            <FileUpload onChange={(files) => console.log(files)} />
            <button
              onClick={handleFileUpload}
              className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}