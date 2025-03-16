import React from "react";

const RecentClassCard = ({ subject, date, status }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Present</span>;
      case "absent":
        return <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Absent</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate mr-2">{subject}</h4>
        {getStatusBadge(status)}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">{formatDate(date)}</div>
    </div>
  );
};

export default RecentClassCard;