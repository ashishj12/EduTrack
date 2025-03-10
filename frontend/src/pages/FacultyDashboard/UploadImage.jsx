import { Calendar, Upload } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const UploadImage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [componentLoaded, setComponentLoaded] = useState(false);
  const fileInputRef = useRef(null);

  // Add component load effect
  useEffect(() => {
    setComponentLoaded(true);
  }, []);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  // Handle file selection via button
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, JPEG)');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing attendance with file:', selectedFile);
    // Normally, you would call an API to handle the file upload here
  };

  return (
    <div className={`w-full bg-white transition-opacity duration-300 ${componentLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-2">Upload Attendance Image</h1>
        <p className="text-gray-600 mb-6">Process attendance using image recognition</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="text-gray-400 mb-4" size={32} />

              <p className="text-gray-500 mb-4">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Drag & drop your image here or"}
              </p>

              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png"
              />

              <button
                type="button"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                Browse Files
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Supports: JPG, PNG, JPEG (Max: 10MB)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Subject Selection */}
            <div>
              <label htmlFor="subject" className="block text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                id="subject"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a subject
                </option>
                <option value="bda">Big Data Analytics</option>
                <option value="dm">Disaster Management</option>
                <option value="stv">STV</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="2025-03-08"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            {/* Class/Batch Selection */}
            <div>
              <label htmlFor="class" className="block text-gray-700 mb-2">
                Select Class/Batch
              </label>
              <select
                id="class"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select batch
                </option>
                <option value="2021">2021</option>
              </select>
            </div>

            {/* Semester Selection */}
            <div>
              <label htmlFor="semester" className="block text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                id="semester"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select semester
                </option>
                <option value="sem8">Semester 8</option>
              </select>
            </div>
          </div>

        
          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={!selectedFile}
            >
              Process Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;