import { X } from "lucide-react"
import React from "react"

const NotificationBar = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: "faculty",
      message: "Prof. Johnson has rescheduled tomorrow's Data Structures class.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "academic",
      message: "Reminder: Mid-term exams start next week.",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "faculty",
      message: "New assignment posted for Computer Networks.",
      time: "1 day ago",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-1">
                {notification.type === "faculty" ? "Faculty Update" : "Academic Notice"}
              </div>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationBar

