"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { Notification } from "@/components/Notification"

type NotificationType = "info" | "success" | "warning" | "error"

type NotificationContextType = {
  addNotification: (message: string, type: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: NotificationType }>>([])

  const addNotification = useCallback((message: string, type: NotificationType) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message, type }])
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notifications.map(({ id, message, type }) => (
        <Notification key={id} message={message} type={type} onClose={() => removeNotification(id)} />
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

