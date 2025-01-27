"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useNotification } from "@/contexts/NotificationContext"

type SearchResult = {
  id: string
  type: "user" | "event" | "sale" | "payment"
  name: string
  details: string
}

const columns: ColumnDef<SearchResult>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "details",
    header: "Détails",
  },
]

export default function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([])
  const searchParams = useSearchParams()
  const { addNotification } = useNotification()

  useEffect(() => {
    const searchTerm = searchParams.get("q")
    if (searchTerm) {
      fetchSearchResults(searchTerm)
    }
  }, [searchParams])

  const fetchSearchResults = async (searchTerm: string) => {
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error fetching search results:", error)
      addNotification("Erreur lors de la recherche", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Résultats de recherche</h1>
      <DataTable columns={columns} data={results} />
    </div>
  )
}

