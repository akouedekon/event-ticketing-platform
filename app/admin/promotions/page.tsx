"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ActionButtons } from "@/components/ui/action-buttons"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Promotion = {
  id: string
  code: string
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number
  startDate: Date
  endDate: Date
  isActive: boolean
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id">>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
  })
  const router = useRouter()
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/admin/promotions")
      if (!response.ok) {
        throw new Error("Failed to fetch promotions")
      }
      const data = await response.json()
      setPromotions(data)
    } catch (error) {
      console.error("Error fetching promotions:", error)
      addNotification("Erreur lors du chargement des promotions", "error")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPromotion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewPromotion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      })
      if (!response.ok) {
        throw new Error("Failed to create promotion")
      }
      addNotification("Promotion créée avec succès", "success")
      fetchPromotions()
      setNewPromotion({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
      })
    } catch (error) {
      console.error("Error creating promotion:", error)
      addNotification("Erreur lors de la création de la promotion", "error")
    }
  }

  const handleEdit = (promotionId: string) => {
    router.push(`/admin/promotions/${promotionId}/edit`)
  }

  const handleDelete = async (promotionId: string) => {
    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete promotion")
      }
      addNotification("Promotion supprimée avec succès", "success")
      fetchPromotions()
    } catch (error) {
      console.error("Error deleting promotion:", error)
      addNotification("Erreur lors de la suppression de la promotion", "error")
    }
  }

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "discountType",
      header: "Type de réduction",
      cell: ({ row }) => {
        return row.getValue("discountType") === "PERCENTAGE" ? "Pourcentage" : "Montant fixe"
      },
    },
    {
      accessorKey: "discountValue",
      header: "Valeur de la réduction",
      cell: ({ row }) => {
        const value = row.getValue("discountValue") as number
        const type = row.getValue("discountType") as string
        return type === "PERCENTAGE" ? `${value}%` : `${value} €`
      },
    },
    {
      accessorKey: "startDate",
      header: "Date de début",
      cell: ({ row }) => {
        return new Date(row.getValue("startDate")).toLocaleDateString()
      },
    },
    {
      accessorKey: "endDate",
      header: "Date de fin",
      cell: ({ row }) => {
        return new Date(row.getValue("endDate")).toLocaleDateString()
      },
    },
    {
      accessorKey: "isActive",
      header: "Actif",
      cell: ({ row }) => {
        return row.getValue("isActive") ? "Oui" : "Non"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const promotion = row.original
        return <ActionButtons onEdit={() => handleEdit(promotion.id)} onDelete={() => handleDelete(promotion.id)} />
      },
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des promotions</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input name="code" placeholder="Code promo" value={newPromotion.code} onChange={handleInputChange} required />
        <Select
          name="discountType"
          value={newPromotion.discountType}
          onValueChange={(value) => handleSelectChange("discountType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de réduction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
            <SelectItem value="FIXED_AMOUNT">Montant fixe</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="discountValue"
          type="number"
          placeholder="Valeur de la réduction"
          value={newPromotion.discountValue}
          onChange={handleInputChange}
          required
        />
        <Input
          name="startDate"
          type="date"
          value={newPromotion.startDate.toISOString().split("T")[0]}
          onChange={handleInputChange}
          required
        />
        <Input
          name="endDate"
          type="date"
          value={newPromotion.endDate.toISOString().split("T")[0]}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">Créer une promotion</Button>
      </form>
      <DataTable columns={columns} data={promotions} />
    </div>
  )
}

