"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des événements")
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        setError("Erreur lors du chargement des événements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = isLoading
    ? []
    : events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Découvrez les meilleurs événements</h1>
      <div className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Rechercher un événement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>
      {isLoading && <p className="text-center">Chargement des événements...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-4">{event.location}</p>
              <Link href={`/event/${event.id}`}>
                <Button className="w-full">Voir les détails</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

