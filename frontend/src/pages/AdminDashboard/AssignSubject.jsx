import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import { useAuth } from "../../context/authContext"; 

const AssignSubject = ({ isOpen, onClose, onSubmit }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectSem: "",
    facultyId: "",
  });

  const { assignSubjectToFaculty, getAllFaculties } = useAuth();
  useEffect(() => {
    setModalOpen(isOpen);
    if (isOpen) {
      fetchFaculties();
    }
  }, [isOpen]);

  // Function to fetch faculties from database
  const fetchFaculties = async () => {
    try {
      const response = await getAllFaculties();
      if (response && response.faculties) {
        setFaculties(response.faculties);
      } 
      else {
        throw new Error("Failed to load faculty data");
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load faculty data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to validate form data
  const validateForm = () => {
    const { subjectName, subjectSem, facultyId } = formData;
    if (!subjectName || !subjectSem || !facultyId) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await assignSubjectToFaculty(
        formData.subjectName, 
        formData.subjectSem, 
        formData.facultyId
      );

      if (onSubmit) {
        onSubmit(formData);
      }
      Swal.fire({
        title: "Done!",
        text: "Subject assigned to faculty successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setFormData({
        subjectName: "",
        subjectSem: "",
        facultyId: "",
      });

      // Close the modal
      handleClose();
    } catch (error) {
      console.error("Error assigning subject:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while assigning the subject.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
  }
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="bg-white rounded-lg shadow-xl p-6 relative">
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" > ✕ </button>

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
                name="subjectSem"
                value={formData.subjectSem}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required >
                <option value="">Select semester</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Faculty
              </label>
              <select
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required >
                <option value="">Select faculty member</option>
                {faculties.length > 0 ? (
                  faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name} ({faculty.department})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No faculty members found</option>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors" >
              Assign Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;
