import React from "react"
const ScheduleCard = ({ subject, time, room, status }) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium">{subject}</h4>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="mr-4">{time}</span>
          <span>{room}</span>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>{status}</span>
    </div>
  )
}

export default ScheduleCard

