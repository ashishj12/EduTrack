import React from "react";

const Calendar = ({ month, year }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const currentDate = new Date();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day) => {
    return currentDate.getDate() === day && currentDate.getMonth() === month && currentDate.getFullYear() === year;
  };

  const isPastDay = (day) => {
    const checkDate = new Date(year, month, day);
    return checkDate < new Date(currentDate.setHours(0, 0, 0, 0));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Monthly Overview</h3>
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm text-gray-600 font-medium py-1 sm:py-2">
            {day}
          </div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="text-center p-1 sm:p-2" />
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`text-center p-1 sm:p-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${
              isToday(day)
                ? "bg-blue-600 text-white font-bold"
                : isPastDay(day)
                ? "bg-green-100 text-green-800"
                : "hover:bg-gray-50"
            }`} >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;