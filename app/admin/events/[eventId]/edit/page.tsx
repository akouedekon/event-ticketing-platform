"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/NotificationContext"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type Event = {
  id: string
  name: string
  date: string
  location: string
  organizerName: string
  isPaid: boolean
}

export default function EditEventPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()
  const { addNotification } = useNotification()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/admin/events/${params.eventId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch event")
        }
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        console.error("Error fetching event:", error)
        addNotification("Erreur lors du chargement de l'événement", "error")
      }
    }

    fetchEvent()
  }, [params.eventId, addNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    try {
      const response = await fetch(`/api/admin/events/${params.eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      addNotification("Événement mis à jour avec succès", "success")
      router.push("/admin/events")
    } catch (error) {
      console.error("Error updating event:", error)
      addNotification("Erreur lors de la mise à jour de l'événement", "error")
    }
  }

  if (!event) {
    return <div>Chargement...</div>
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l'événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <Input id="name" value={event.name} onChange={(e) => setEvent({ ...event, name: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            id="date"
            type="datetime-local"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Lieu
          </label>
          <Input
            id="location"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700">
            Organisateur
          </label>
          <Input
            id="organizerName"
            value={event.organizerName}
            onChange={(e) => setEvent({ ...event, organizerName: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center">
          <Checkbox
            id="isPaid"
            checked={event.isPaid}
            onCheckedChange={(checked) => setEvent({ ...event, isPaid: checked as boolean })}
          />
          <label htmlFor="isPaid" className="ml-2 block text-sm font-medium text-gray-700">
            Payé
          </label>
        </div>
        <Button type="submit">Mettre à jour</Button>
      </form>
    </Card>
  )
}

