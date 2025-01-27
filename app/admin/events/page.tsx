"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ActionButtons } from "@/components/ui/action-buttons"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"

type Event = {
  id: string
  name: string
  date: Date
  location: string
  organizerName: string
  ticketsSold: number
  isPaid: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const router = useRouter()
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
      addNotification("Erreur lors du chargement des événements", "error")
    }
  }

  const handleEdit = (eventId: string) => {
    router.push(`/admin/events/${eventId}/edit`)
  }

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      setEvents(events.filter((event) => event.id !== eventId))
      addNotification("Événement supprimé avec succès", "success")
    } catch (error) {
      console.error("Error deleting event:", error)
      addNotification("Erreur lors de la suppression de l'événement", "error")
    }
  }

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString()
      },
    },
    {
      accessorKey: "location",
      header: "Lieu",
    },
    {
      accessorKey: "organizerName",
      header: "Organisateur",
    },
    {
      accessorKey: "ticketsSold",
      header: "Billets vendus",
    },
    {
      accessorKey: "isPaid",
      header: "Payé",
      cell: ({ row }) => {
        return row.getValue("isPaid") ? "Oui" : "Non"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original
        return <ActionButtons onEdit={() => handleEdit(event.id)} onDelete={() => handleDelete(event.id)} />
      },
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des événements</h1>
      <Button onClick={() => router.push("/admin/events/create")} className="mb-4">
        Créer un nouvel événement
      </Button>
      <DataTable columns={columns} data={events} />
    </div>
  )
}

