"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"

type Ticket = {
  id: string
  eventId: string
  type: string
  price: number
  quantity: number
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [newTicket, setNewTicket] = useState<Omit<Ticket, "id">>({
    eventId: "",
    type: "",
    price: 0,
    quantity: 0,
  })

  // Simulons une liste d'événements
  const events = [
    { id: "1", title: "Concert de Rock" },
    { id: "2", title: "Conférence Tech" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTicket((prev) => ({ ...prev, [name]: name === "price" || name === "quantity" ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ticketWithId = { ...newTicket, id: Date.now().toString() }
    setTickets((prev) => [...prev, ticketWithId])
    setNewTicket({
      eventId: "",
      type: "",
      price: 0,
      quantity: 0,
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des billets</h1>
      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="text-xl font-semibold mb-4">Créer un nouveau type de billet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select name="eventId" value={newTicket.eventId} onChange={handleInputChange} required>
              <option value="">Sélectionnez un événement</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </Select>
            <Select name="type" value={newTicket.type} onChange={handleInputChange} required>
              <option value="">Sélectionnez un type de billet</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
              <option value="early_bird">Early Bird</option>
            </Select>
            <Input
              name="price"
              type="number"
              placeholder="Prix"
              value={newTicket.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <Input
              name="quantity"
              type="number"
              placeholder="Quantité disponible"
              value={newTicket.quantity}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>
          <Button type="submit" className="mt-4">
            Créer le type de billet
          </Button>
        </form>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4">
            <h3 className="text-xl font-semibold mb-2">{events.find((e) => e.id === ticket.eventId)?.title}</h3>
            <p className="text-gray-600 mb-2">Type: {ticket.type}</p>
            <p className="text-gray-600 mb-2">Prix: {ticket.price} €</p>
            <p className="text-gray-600 mb-2">Quantité: {ticket.quantity}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

