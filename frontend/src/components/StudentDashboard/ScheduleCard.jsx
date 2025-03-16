import React from "react";

const ScheduleCard = ({ subject, time, room, status }) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 text-sm sm:text-base">{subject}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mt-1">
          <span className="mr-0 sm:mr-4 mb-1 sm:mb-0">{time}</span>
          <span>{room}</span>
        </div>
      </div>
      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusStyle(status)} whitespace-nowrap ml-2`}>
        {status}
      </span>
    </div>
  );
};

export default ScheduleCard;