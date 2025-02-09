import React from "react"
const CircularProgress = ({ percentage }) => {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
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
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">{percentage}%</span>
    </div>
  )
}

const AttendanceCard = ({ subject, totalClasses, present, absent, rate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{subject}</h3>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-600">Total Classes: </span>
            <span className="font-medium">{totalClasses}</span>
          </div>
          <div className="text-sm">
            <span className="text-green-600">Present: {present}</span>
          </div>
          <div className="text-sm">
            <span className="text-red-500">Absent: {absent}</span>
          </div>
        </div>
        <CircularProgress percentage={rate} />
      </div>
    </div>
  )
}

export default AttendanceCard

