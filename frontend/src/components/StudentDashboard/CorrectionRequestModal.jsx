import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/authContext";

const CorrectionRequestModal = ({ isOpen, onClose, subjectsData = [] }) => {
  const { submitCorrectionRequest, currentUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    subjectId: "", // Changed from subject to subjectId
    date: "",
    reason: "",
    details: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      document.body.style.overflow = '';
      setAnimateIn(false);
      setFormData({
        subjectId: "", // Reset subjectId field
        date: "",
        reason: "",
        details: "",
      });
      setError("");
      setSuccess("");
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      // Ensure we have a valid MongoDB ObjectId (24 hex characters)
      if (!formData.subjectId || !/^[0-9a-fA-F]{24}$/.test(formData.subjectId)) {
        throw new Error("Please select a valid subject");
      }
      
      const correctionData = {
        ...formData,
        studentId: currentUser?._id
      };
      
      await submitCorrectionRequest(correctionData);
      setSuccess("Correction request submitted successfully!");
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Error submitting correction request:", err);
      setError(err.message || "Failed to submit correction request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}>
      <div 
        className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 shadow-xl transition-all duration-300 ease-in-out transform"
        style={{ 
          transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: animateIn ? 1 : 0
        }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Request Attendance Correction</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm rounded border border-green-200">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Subject</option>
              {subjectsData.length > 0 ? (
                subjectsData.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subject}
                  </option>
                ))
              ) : (
                <option value="" disabled>No subjects available</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]} // Can't select future dates
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Reason for Correction</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Reason</option>
              <option value="Marked Absent but Present">Marked Absent but Present</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Additional Details</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              rows="3"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              required
              disabled={isSubmitting}
              placeholder="Please provide details about your request..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorrectionRequestModal;