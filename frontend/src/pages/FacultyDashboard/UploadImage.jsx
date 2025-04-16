import { Upload, X, CheckCircle, Loader } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";

const UploadImage = ({ onClose, selectedClass }) => {
  const { markAttendance, getAssignedSubjects } = useAuth();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const fileInputRef = useRef(null);

  function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  useEffect(() => {
    if (!selectedClass) {
      setError("Class information not provided.");
    }
  }, [selectedClass]);

  // Fetch assigned subjects for the faculty
  useEffect(() => {
    const loadAssignedSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const response = await getAssignedSubjects();

        // Extract subjects from the response
        let subjectsData = [];
        if (Array.isArray(response)) {
          subjectsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          subjectsData = response.data;
        } else if (
          response &&
          response.subjects &&
          Array.isArray(response.subjects)
        ) {
          subjectsData = response.subjects;
        }
        setAssignedSubjects(subjectsData);
      } catch (err) {
        console.error("Error loading subjects:", err);
        setError("Could not load assigned subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadAssignedSubjects();
  }, [getAssignedSubjects]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(["dragenter", "dragover"].includes(e.type));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) processFile(file);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type.toLowerCase())) {
      setError("Please select a valid image file (JPG, PNG, JPEG)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("attendanceImage", selectedFile);
      formData.append("subjectId", e.target.subject.value);
      formData.append("date", selectedDate);
      formData.append("batch", e.target.class.value);
      formData.append("semester", e.target.semester.value);

      const result = await markAttendance(formData);
      console.log("Attendance marked successfully:", result);

      // Show SweetAlert in the center of the screen
      Swal.fire({
        position: "center", // Set position to center
        icon: "success",
        title: "Attendance Mark Successfully!",
        showConfirmButton: false,
        timer: 1500
      });

      setSuccess(true);
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error("Attendance submission error:", err);
      setError(
        err.message || "Failed to process attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full bg-white rounded-xl p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mb-3 md:mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Attendance Marked Successfully!
          </h2>
          <p className="text-gray-600 mb-5 md:mb-6">
            The attendance has been processed and recorded.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl">
      <div className="p-3 md:p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">
              {selectedClass?.name || "Upload Attendance"}
            </h1>
            {selectedClass?.code && (
              <p className="text-gray-600 text-sm">{selectedClass.code}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload box - Improved responsiveness */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } ${imagePreview ? "p-0" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative w-full h-32 sm:h-36 md:h-40">
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
              <div className="flex flex-col items-center justify-center py-4 md:py-6">
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
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700"
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

          {/* Dropdowns and inputs - Improved responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm text-gray-700 mb-1"
              >
                Select Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Choose a subject
                </option>
                {loadingSubjects ? (
                  <option value="" disabled>
                    Loading subjects...
                  </option>
                ) : (
                  assignedSubjects.map((subject) => (
                    <option
                      key={subject._id || subject.id}
                      value={subject._id || subject.id}
                    >
                      {subject.subjectName || subject.name} (Sem{" "}
                      {subject.subjectSem || subject.semester})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm text-gray-700 mb-1"
              >
                Select Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDate}
                onChange={handleDateChange}
                onClick={(e) => e.preventDefault()}
                readOnly
                required
              />
            </div>

            <div>
              <label
                htmlFor="class"
                className="block text-sm text-gray-700 mb-1"
              >
                Select Class/Batch
              </label>
              <select
                id="class"
                name="class"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="2021"
                required
              >
                <option value="" disabled>
                  Select batch
                </option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="semester"
                className="block text-sm text-gray-700 mb-1"
              >
                Select Semester
              </label>
              <select
                id="semester"
                name="semester"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="8"
                required
              >
                <option value="" disabled>
                  Select semester
                </option>
                {[8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Completely redesigned button container */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-center inline-flex items-center justify-center"
              style={{ minWidth: "180px" }} // Explicit min-width to ensure text fits
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Attendance"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;