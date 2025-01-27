"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"

type Refund = {
  id: string
  orderId: string
  amount: number
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
}

const columns: ColumnDef<Refund>[] = [
  {
    accessorKey: "orderId",
    header: "ID de commande",
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      return `${row.getValue("amount")} €`
    },
  },
  {
    accessorKey: "reason",
    header: "Raison",
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    accessorKey: "createdAt",
    header: "Date de demande",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const refund = row.original
      return (
        <div className="flex space-x-2">
          <Button onClick={() => handleApprove(refund.id)} disabled={refund.status !== "PENDING"}>
            Approuver
          </Button>
          <Button onClick={() => handleReject(refund.id)} disabled={refund.status !== "PENDING"} variant="destructive">
            Rejeter
          </Button>
        </div>
      )
    },
  },
]

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchRefunds()
  }, [])

  const fetchRefunds = async () => {
    try {
      const response = await fetch("/api/admin/refunds")
      if (!response.ok) {
        throw new Error("Failed to fetch refunds")
      }
      const data = await response.json()
      setRefunds(data)
    } catch (error) {
      console.error("Error fetching refunds:", error)
      addNotification("Erreur lors du chargement des demandes de remboursement", "error")
    }
  }

  const handleApprove = async (refundId: string) => {
    try {
      const response = await fetch(`/api/admin/refunds/${refundId}/approve`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to approve refund")
      }
      addNotification("Remboursement approuvé avec succès", "success")
      fetchRefunds()
    } catch (error) {
      console.error("Error approving refund:", error)
      addNotification("Erreur lors de l'approbation du remboursement", "error")
    }
  }

  const handleReject = async (refundId: string) => {
    try {
      const response = await fetch(`/api/admin/refunds/${refundId}/reject`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to reject refund")
      }
      addNotification("Remboursement rejeté avec succès", "success")
      fetchRefunds()
    } catch (error) {
      console.error("Error rejecting refund:", error)
      addNotification("Erreur lors du rejet du remboursement", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des remboursements</h1>
      <DataTable columns={columns} data={refunds} />
    </div>
  )
}

