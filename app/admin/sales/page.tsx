"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"

type Sale = {
  id: string
  eventName: string
  buyerName: string
  amount: number
  date: Date
}

const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "eventName",
    header: "Événement",
  },
  {
    accessorKey: "buyerName",
    header: "Acheteur",
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      return `${row.getValue("amount")} €`
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString()
    },
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/admin/sales")
      if (!response.ok) {
        throw new Error("Failed to fetch sales")
      }
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error("Error fetching sales:", error)
      addNotification("Erreur lors du chargement des ventes", "error")
    }
  }

  const csvData = sales.map((sale) => ({
    ...sale,
    date: new Date(sale.date).toLocaleDateString(),
    amount: `${sale.amount} €`,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des ventes</h1>
      <div className="mb-4">
        <CSVLink data={csvData} filename="sales.csv">
          <Button>Exporter en CSV</Button>
        </CSVLink>
      </div>
      <DataTable columns={columns} data={sales} />
    </div>
  )
}

