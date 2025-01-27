"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useNotification } from "@/contexts/NotificationContext"

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    price: "",
  })
  const router = useRouter()
  const { data: session } = useSession()
  const { addNotification } = useNotification()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      addNotification("Vous devez être connecté pour créer un événement", "error")
      return
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) throw new Error("Erreur lors de la création de l'événement")

      const event = await response.json()

      // Redirect to payment
      const paymentResponse = await fetch(`/api/events/${event.id}/pay`, {
        method: "POST",
      })

      if (!paymentResponse.ok) throw new Error("Erreur lors de l'initialisation du paiement")

      const { checkoutUrl } = await paymentResponse.json()

      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Failed to create event:", error)
      addNotification("Erreur lors de la création de l'événement", "error")
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Créer un nouvel événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Nom de l'événement"
          value={eventData.name}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="description"
          placeholder="Description de l'événement"
          value={eventData.description}
          onChange={handleInputChange}
          required
        />
        <Input name="date" type="datetime-local" value={eventData.date} onChange={handleInputChange} required />
        <Input
          name="location"
          placeholder="Lieu de l'événement"
          value={eventData.location}
          onChange={handleInputChange}
          required
        />
        <Input
          name="price"
          type="number"
          step="0.01"
          placeholder="Prix de l'événement"
          value={eventData.price}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">Créer et payer</Button>
      </form>
    </Card>
  )
}

