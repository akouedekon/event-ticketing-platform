"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"

type Payment = {
  id: string
  amount: number
  status: string
  mollieId: string
  userName: string
  eventName: string
  date: Date
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "mollieId",
    header: "ID Mollie",
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      return `${row.getValue("amount")} €`
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    accessorKey: "userName",
    header: "Utilisateur",
  },
  {
    accessorKey: "eventName",
    header: "Événement",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString()
    },
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments")
      if (!response.ok) {
        throw new Error("Failed to fetch payments")
      }
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error("Error fetching payments:", error)
      addNotification("Erreur lors du chargement des paiements", "error")
    }
  }

  const csvData = payments.map((payment) => ({
    ...payment,
    date: new Date(payment.date).toLocaleDateString(),
    amount: `${payment.amount} €`,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des paiements</h1>
      <div className="mb-4">
        <CSVLink data={csvData} filename="payments.csv">
          <Button>Exporter en CSV</Button>
        </CSVLink>
      </div>
      <DataTable columns={columns} data={payments} />
    </div>
  )
}

