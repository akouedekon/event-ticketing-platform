"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"

type Sale = {
  id: string
  eventName: string
  ticketsSold: number
  totalAmount: number
  date: string
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const { data: session } = useSession()
  const { addNotification } = useNotification()

  useEffect(() => {
    const fetchSales = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/organizer/${session.user.id}/sales`)
        const data = await response.json()
        setSales(data)
      }
    }
    fetchSales()
  }, [session])

  const handleWithdraw = async (saleId: string) => {
    try {
      const response = await fetch(`/api/organizer/sales/${saleId}/withdraw`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Erreur lors du retrait")
      addNotification("Retrait effectué avec succès", "success")
      // Refresh sales data
      const updatedSales = sales.filter((sale) => sale.id !== saleId)
      setSales(updatedSales)
    } catch (error) {
      console.error("Failed to withdraw:", error)
      addNotification("Erreur lors du retrait", "error")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes ventes</h1>
      {sales.map((sale) => (
        <Card key={sale.id} className="p-4 mb-4">
          <h2 className="text-xl font-semibold">{sale.eventName}</h2>
          <p>Billets vendus: {sale.ticketsSold}</p>
          <p>Montant total: {sale.totalAmount} €</p>
          <p>Date: {new Date(sale.date).toLocaleDateString()}</p>
          <Button onClick={() => handleWithdraw(sale.id)} className="mt-2">
            Récupérer l'argent
          </Button>
        </Card>
      ))}
    </div>
  )
}

