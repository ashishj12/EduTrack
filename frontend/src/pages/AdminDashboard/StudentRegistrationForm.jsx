import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2
const StudentRegistrationForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    branch: "",
    semester: "",
    batch: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBranchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      branch: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call onSubmit with form data

    // Show SweetAlert on successful registration
    Swal.fire({
      title: "Done!",
      text: "Student registered successfully.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Student</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label htmlFor="studentName" className="block font-medium">
              Student Name
            </label>
            <input
              id="studentName"
              name="studentName"
              placeholder="Enter student's full name"
              value={formData.studentName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="block font-medium">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleBranchChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select branch</option>
              <option value="computer-science">Computer Science</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="semester" className="block font-medium">
              Semester
            </label>
            <input
              id="semester"
              name="semester"
              placeholder="Enter semester (1-8)"
              value={formData.semester}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="batch" className="block font-medium">
              Batch
            </label>
            <input
              id="batch"
              name="batch"
              placeholder="Enter batch year (e.g., 2023-2027)"
              value={formData.batch}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md">
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
