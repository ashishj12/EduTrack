import { useState } from "react";
import Swal from "sweetalert2"; // Added import for SweetAlert

export default function FacultyAssignmentForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    facultyName: "",
    department: "",
    subjects: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      department: e.target.value,
    }));
  };

  const toggleSubject = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data before submission
    if (
      !formData.facultyName ||
      !formData.department ||
      formData.subjects.length === 0
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    // Show SweetAlert on successful registration
    Swal.fire({
      title: "Done!",
      text: "Faculty registered successfully.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });

    onSubmit(formData);
    onClose(); // Close the form after submission
  };

  // Sample data for departments and subjects
  const departments = [
    { id: "cs", name: "Computer Science" }
  ];

  const subjects = [
    { id: "bda1", name: "Big Data Analysis" },
    { id: "dm2", name: "Disater Mangement" },
    { id: "pro3", name: "Project" },
    { id: "st4", name: "Software Testing" },
  ];

  // If form is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faculty Assignment</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="facultyName" className="block font-medium">
              Faculty Name
            </label>
            <input
              id="facultyName"
              name="facultyName"
              type="text"
              placeholder="Enter faculty name"
              value={formData.facultyName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="block font-medium">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select department
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-medium mb-2">Subjects</label>
            <div className="border border-gray-300 rounded-md p-2">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    formData.subjects.includes(subject.id)
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleSubject(subject.id)}
                >
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    checked={formData.subjects.includes(subject.id)}
                    onChange={() => toggleSubject(subject.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`subject-${subject.id}`}
                    className="flex-grow cursor-pointer"
                  >
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
            {formData.subjects.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least one subject
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-colors duration-300"
          >
            Assign Faculty
          </button>
        </form>
      </div>
    </div>
  );
}