import { Camera, Eye, X } from 'lucide-react';
import { useState } from 'react';
import UploadImage from '../../../pages/FacultyDashboard/UploadImage';

export default function QuickActions() {
  const [fileUpload, setFileUpload] = useState(false);

  const handleFileUpload = () => {
    // Toggle the visibility of the file upload component and add background blur
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

      {/* File Upload Overlay with Background Blur Effect */}
      {fileUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center  bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh] animate-scale-in">
            {/* Close Button */}
            <button
              onClick={handleFileUpload}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow-md z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <UploadImage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
