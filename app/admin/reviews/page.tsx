"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ActionButtons } from "@/components/ui/action-buttons"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Review = {
  id: string
  userId: string
  userName: string
  eventId: string
  eventName: string
  rating: number
  comment: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchReviews()
  }, []) // Removed unnecessary dependency: statusFilter

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/admin/reviews?status=${statusFilter}`)
      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      addNotification("Erreur lors du chargement des avis", "error")
    }
  }

  const handleStatusChange = async (reviewId: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update review status")
      }
      addNotification(`Avis ${newStatus === "APPROVED" ? "approuvé" : "rejeté"} avec succès`, "success")
      fetchReviews()
    } catch (error) {
      console.error("Error updating review status:", error)
      addNotification("Erreur lors de la mise à jour du statut de l'avis", "error")
    }
  }

  const handleDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete review")
      }
      addNotification("Avis supprimé avec succès", "success")
      fetchReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
      addNotification("Erreur lors de la suppression de l'avis", "error")
    }
  }

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "userName",
      header: "Utilisateur",
    },
    {
      accessorKey: "eventName",
      header: "Événement",
    },
    {
      accessorKey: "rating",
      header: "Note",
    },
    {
      accessorKey: "comment",
      header: "Commentaire",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const review = row.original
        return (
          <div className="flex space-x-2">
            {review.status === "PENDING" && (
              <>
                <Button onClick={() => handleStatusChange(review.id, "APPROVED")} size="sm">
                  Approuver
                </Button>
                <Button onClick={() => handleStatusChange(review.id, "REJECTED")} size="sm" variant="destructive">
                  Rejeter
                </Button>
              </>
            )}
            <ActionButtons onDelete={() => handleDelete(review.id)} />
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des avis</h1>
      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="APPROVED">Approuvé</SelectItem>
            <SelectItem value="REJECTED">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={reviews} />
    </div>
  )
}

