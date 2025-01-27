"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"

type Log = {
  id: string
  action: string
  userId: string
  userName: string
  details: string
  timestamp: Date
}

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "userName",
    header: "Utilisateur",
  },
  {
    accessorKey: "details",
    header: "Détails",
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("timestamp")).toLocaleString()
    },
  },
]

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/logs")
      if (!response.ok) {
        throw new Error("Failed to fetch logs")
      }
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
      addNotification("Erreur lors du chargement des logs", "error")
    }
  }

  const csvData = logs.map((log) => ({
    ...log,
    timestamp: new Date(log.timestamp).toLocaleString(),
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs d'administration</h1>
      <div className="mb-4">
        <CSVLink data={csvData} filename="admin_logs.csv">
          <Button>Exporter en CSV</Button>
        </CSVLink>
      </div>
      <DataTable columns={columns} data={logs} />
    </div>
  )
}

