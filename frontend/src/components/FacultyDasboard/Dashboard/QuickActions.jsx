import { Camera, X } from 'lucide-react';
import { useState } from 'react';
import UploadImage from '../../../pages/FacultyDashboard/UploadImage';

export default function QuickActions() {
  const [fileUpload, setFileUpload] = useState(false);

  const handleFileUpload = () => {
    setFileUpload(!fileUpload);
  };

  return (
    <div className="relative animate-fadeIn pt-20">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Mark Attendance Section */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between border border-gray-100 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Mark Attendance</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base text-center">
            Take attendance using image recognition
          </p>
          <button
            onClick={handleFileUpload}
            className="text-white bg-blue-600 font-medium hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors w-full">
            Upload Image
          </button>
        </div>
      </div>

      {/* File Upload Overlay with Background Blur Effect */}
      {fileUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn overflow-y-auto p-4">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex justify-end p-2">
              <button 
                onClick={handleFileUpload} 
                className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <UploadImage onClose={handleFileUpload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}