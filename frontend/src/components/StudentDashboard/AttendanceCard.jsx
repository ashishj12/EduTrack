import React from "react";

const CircularProgress = ({ percentage }) => {
  const radius = 30; // Set radius size
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      {/* SVG with responsive viewBox to scale properly */}
      <svg
        className="w-full h-full transform -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80" // Viewbox for consistent scaling
      >
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className="text-green-500"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      {/* Percentage text, center inside the circle */}
      <span className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-semibold">
        {percentage}%
      </span>
    </div>
  );
};

const AttendanceCard = ({ subject, totalClasses, present, absent, rate }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        {subject}
      </h3>
      <div className="flex justify-between items-center">
        <div className="space-y-1 sm:space-y-2">
          <div className="text-xs sm:text-sm">
            <span className="text-gray-600">Total Classes: </span>
            <span className="font-medium">{totalClasses}</span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-green-600 font-medium">
              Present: {present}
            </span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="text-red-500 font-medium">Absent: {absent}</span>
          </div>
        </div>
        {/* Wrapping CircularProgress in a div to manage its size */}
        <div className="flex-shrink-0">
          <CircularProgress percentage={rate} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
