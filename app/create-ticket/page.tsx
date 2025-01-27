"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { useNotification } from "@/contexts/NotificationContext"

export default function CreateTicket() {
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [ticketPrice, setTicketPrice] = useState("")
  const [ticketQuantity, setTicketQuantity] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations("createTicket")
  const { addNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      addNotification(t("notLoggedIn"), "error")
      router.push("/auth/signin")
      return
    }

    // TODO: Implement API call to create ticket
    console.log("Creating ticket:", {
      eventName,
      eventDate,
      eventLocation,
      ticketPrice,
      ticketQuantity,
      eventDescription,
    })

    addNotification(t("ticketCreated"), "success")
    router.push("/organizer/events")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <h1 className="text-2xl font-bold mb-6">{t("createTicket")}</h1>
          <div>
            <Input
              placeholder={t("eventName")}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </div>
          <div>
            <Input
              placeholder={t("eventLocation")}
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder={t("ticketPrice")}
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder={t("ticketQuantity")}
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(e.target.value)}
              required
              min="1"
            />
          </div>
          <div>
            <Textarea
              placeholder={t("eventDescription")}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t("createTicket")}
          </Button>
        </form>
      </Card>
    </div>
  )
}

