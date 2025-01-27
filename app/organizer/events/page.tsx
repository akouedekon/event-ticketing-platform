"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  image: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    image: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventWithId = { ...newEvent, id: Date.now().toString() }
    setEvents((prev) => [...prev, eventWithId])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      image: "",
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des événements</h1>
      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="text-xl font-semibold mb-4">Créer un nouvel événement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="title"
              placeholder="Titre de l'événement"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
            <Input name="date" type="datetime-local" value={newEvent.date} onChange={handleInputChange} required />
            <Input name="location" placeholder="Lieu" value={newEvent.location} onChange={handleInputChange} required />
            <Select name="category" value={newEvent.category} onChange={handleInputChange} required>
              <option value="">Sélectionnez une catégorie</option>
              <option value="concert">Concert</option>
              <option value="conference">Conférence</option>
              <option value="festival">Festival</option>
              <option value="sport">Sport</option>
            </Select>
            <Input name="image" placeholder="URL de l'image" value={newEvent.image} onChange={handleInputChange} />
            <Textarea
              name="description"
              placeholder="Description de l'événement"
              value={newEvent.description}
              onChange={handleInputChange}
              required
              className="col-span-2"
            />
          </div>
          <Button type="submit" className="mt-4">
            Créer l'événement
          </Button>
        </form>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <img
              src={event.image || "/placeholder.svg?height=200&width=300"}
              alt={event.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleString()}</p>
            <p className="text-gray-600 mb-2">{event.location}</p>
            <p className="text-gray-600 mb-2">{event.category}</p>
            <p className="text-gray-700">{event.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

