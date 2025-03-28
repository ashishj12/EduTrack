import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

const UploadImage = ({ onClose, selectedClass }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      processFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing attendance with file:', selectedFile);
    onClose && onClose();
  };

  return (
    <div className="w-full bg-white rounded-xl">
      <div className="p-4">
        {/* Class Details Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-semibold">
              {selectedClass?.name || 'Upload Attendance'}
            </h1>
            {selectedClass?.code && (
              <p className="text-gray-600 text-sm">{selectedClass.code}</p>
            )}
          </div>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } ${imagePreview ? 'p-0' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop} >
            {imagePreview ? (
              <div className="relative w-full h-40">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Upload className="text-gray-400 mb-2" size={24} />
                <p className="text-gray-500 text-sm mb-2">
                  Drag & drop your image or
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
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700"
                  onClick={() => fileInputRef.current.click()}
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports: JPG, PNG, JPEG (Max: 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div>
              <label htmlFor="subject" className="block text-sm text-gray-700 mb-1">
                Select Subject
              </label>
              <select
                id="subject"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Choose a subject</option>
                <option value="bda">Big Data Analytics</option>
                <option value="dm">Disaster Management</option>
                <option value="stv">STV</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue={getCurrentDate()}
                required
              />
            </div>

            {/* Class/Batch Dropdown */}
            <div>
              <label htmlFor="class" className="block text-sm text-gray-700 mb-1">
                Select Class/Batch
              </label>
              <select
                id="class"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Select batch</option>
                <option value="2021">2021</option>
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <label htmlFor="semester" className="block text-sm text-gray-700 mb-1">
                Select Semester
              </label>
              <select
                id="semester"
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Select semester</option>
                <option value="sem8">Semester 8</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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