"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/contexts/NotificationContext"

export default function BuyTicket({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { data: session } = useSession()
  const { addNotification } = useNotification()

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/api/events/${params.eventId}`)
      const data = await response.json()
      setEvent(data)
    }
    fetchEvent()
  }, [params.eventId])

  const handleBuy = async () => {
    if (!session) {
      addNotification("Vous devez être connecté pour acheter un billet", "error")
      router.push("/auth/signin")
      return
    }

    try {
      const response = await fetch(`/api/events/${params.eventId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'achat du billet")

      const { checkoutUrl } = await response.json()
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Failed to buy ticket:", error)
      addNotification("Erreur lors de l'achat du billet", "error")
    }
  }

  if (!event) return <div>Chargement...</div>

  return (
    <Card className="p-6 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p className="mb-4">{event.description}</p>
      <p className="mb-4">Date: {new Date(event.date).toLocaleString()}</p>
      <p className="mb-4">Lieu: {event.location}</p>
      <p className="mb-4">Prix: {event.price} €</p>
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
        className="mb-4"
      />
      <Button onClick={handleBuy}>Acheter</Button>
    </Card>
  )
}

