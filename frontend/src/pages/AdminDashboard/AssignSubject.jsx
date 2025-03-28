import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Ensure SweetAlert2 is imported

const AssignSubject = ({ isOpen, onClose, onSubmit }) => {
  // State to manage local visibility of the modal
  const [modalOpen, setModalOpen] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    subjectName: "",
    semester: "",
    faculty: "",
  });

  // Effect to handle modal visibility
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.subjectName || !formData.semester || !formData.faculty) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    console.log("Form submitted:", formData);
    
    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }

    // Show success alert
    Swal.fire({
      title: "Done!",
      text: "Subject assigned to faculty successfully.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });

    // Reset form and close
    setFormData({
      subjectName: "",
      semester: "",
      faculty: "",
    });
    
    // Close the modal
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // If modal is not open, return null
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="bg-white rounded-lg shadow-xl p-6 relative">
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">
            Assign Subject to Faculty
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="Enter subject name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select semester</option>
                <option value="8">Semester 8</option> 
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Faculty
              </label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select faculty member</option>
                <option value="faculty1">Shrinath Tailor</option>
                <option value="faculty2">Zubair Ahmed</option>
                <option value="faculty3">Sarvesh Meena</option>
                <option value="faculty4">Deepika Sainani</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Assign Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;