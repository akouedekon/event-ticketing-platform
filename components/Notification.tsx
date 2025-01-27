import { useState, useEffect } from "react"
import { X } from "lucide-react"

type NotificationProps = {
  message: string
  type: "info" | "success" | "warning" | "error"
  duration?: number
  onClose: () => void
}

export function Notification({ message, type, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }[type]

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-md shadow-lg max-w-sm`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 focus:outline-none">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

