import React from "react";

const ScheduleCard = ({ subject, time }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-gray-800 text-base sm:text-lg mb-2 sm:mb-0">
          {subject}
        </h4>
        <span className="text-gray-500 text-sm sm:text-base">{time}</span>
      </div>
    </div>
  );
};

export default ScheduleCard;