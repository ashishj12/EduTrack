import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";

export default function FacultyAssignmentForm({ isOpen, onClose }) {
  const { adminRegisterFaculty } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    department: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.department
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {
      await adminRegisterFaculty(
        formData.username,
        formData.password,
        formData.name,
        formData.department
      );

      // Show SweetAlert on successful registration
      Swal.fire({
        title: "Done!",
        text: "Faculty registered successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });      
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to register faculty.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };
  const departments = [
    { id: "CSE", name: "CSE" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faculty Assignment</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700" > ✕ </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >
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

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-colors duration-300" >
            Assign Faculty
          </button>
        </form>
      </div>
    </div>
  );
}
