import { Camera, Eye } from 'lucide-react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mark Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Mark Attendance</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base text-center">
            Take attendance using image recognition
          </p>
          <button
            onClick={handleFileUpload}
            className="text-blue-600 font-medium hover:bg-blue-50 px-6 py-3 rounded-lg transition-colors w-full md:w-auto"
          >
            Upload Image
          </button>
        </div>

        {/* View Records Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">View Records</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base text-center">
            Check previous attendance records
          </p>
          <button className="text-green-600 font-medium hover:bg-green-50 px-6 py-3 rounded-lg transition-colors w-full md:w-auto">
            View All
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