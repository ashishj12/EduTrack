import { Check, X } from "lucide-react"
import React from "react"

const RecentClassCard = ({ subject, date, status }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-2">{subject}</h3>
      <p className="text-sm text-gray-600 mb-2">{new Date(date).toLocaleDateString()}</p>
      <div className="flex items-center">
        {status === "present" ? (
          <div className="flex items-center text-green-600">
            <Check className="w-5 h-5 mr-1 animate-bounce" />
            <span>Present</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <X className="w-5 h-5 mr-1 animate-bounce" />
            <span>Absent</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentClassCard

