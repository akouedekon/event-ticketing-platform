"use client"

import { useState, useEffect } from "react"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { BarChart, LineChart } from "@/components/Charts"
import { useNotification } from "@/contexts/NotificationContext"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type DashboardData = {
  stats: {
    label: string
    value: string | number
    change?: number
  }[]
  revenueData: any
  userGrowthData: any
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState("month")
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchDashboardData()
  }, []) // Updated useEffect dependency array

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?period=${period}`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      addNotification("Erreur lors du chargement des données du tableau de bord", "error")
    }
  }

  if (!dashboardData) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
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
      <DashboardStats stats={dashboardData.stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Revenus</h2>
          <BarChart data={dashboardData.revenueData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Croissance des utilisateurs</h2>
          <LineChart data={dashboardData.userGrowthData} />
        </div>
      </div>
    </div>
  )
}

