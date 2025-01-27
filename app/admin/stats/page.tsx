"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/Charts"
import { useNotification } from "@/contexts/NotificationContext"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Stats = {
  totalRevenue: number
  totalUsers: number
  totalEvents: number
  totalTicketsSold: number
}

type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    tension?: number
  }[]
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [revenueData, setRevenueData] = useState<ChartData | null>(null)
  const [userGrowthData, setUserGrowthData] = useState<ChartData | null>(null)
  const [eventCategoryData, setEventCategoryData] = useState<ChartData | null>(null)
  const [period, setPeriod] = useState("month")
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchStats()
  }, []) // Updated useEffect dependency array

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?period=${period}`)
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      const data = await response.json()
      setStats(data.stats)
      setRevenueData(data.revenueData)
      setUserGrowthData(data.userGrowthData)
      setEventCategoryData(data.eventCategoryData)
    } catch (error) {
      console.error("Error fetching stats:", error)
      addNotification("Erreur lors du chargement des statistiques", "error")
    }
  }

  if (!stats || !revenueData || !userGrowthData || !eventCategoryData) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Statistiques avancées</h1>
      <div className="mb-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenu total</h2>
            <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(2)} €</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Utilisateurs totaux</h2>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Événements totaux</h2>
            <p className="text-3xl font-bold">{stats.totalEvents}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Billets vendus</h2>
            <p className="text-3xl font-bold">{stats.totalTicketsSold}</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Revenus</h2>
            <BarChart data={revenueData} />
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Croissance des utilisateurs</h2>
            <LineChart data={userGrowthData} />
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Catégories d'événements</h2>
            <PieChart data={eventCategoryData} />
          </div>
        </Card>
      </div>
    </div>
  )
}

