"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/Charts"
import { useNotification } from "@/contexts/NotificationContext"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"

type AnalyticsData = {
  ticketSales: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
    }[]
  }
  revenueOverTime: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      tension: number
    }[]
  }
  audienceDemographics: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
    }[]
  }
  topEvents: {
    name: string
    ticketsSold: number
    revenue: number
  }[]
}

export default function OrganizerAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [eventFilter, setEventFilter] = useState("all")
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchAnalyticsData()
  }, []) //Fixed dependency array

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(
        `/api/organizer/analytics?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}&event=${eventFilter}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      addNotification("Erreur lors du chargement des données d'analyse", "error")
    }
  }

  const handleExportData = () => {
    // Implement export functionality (e.g., CSV download)
    addNotification("Fonctionnalité d'exportation à implémenter", "info")
  }

  if (!analyticsData) {
    return <div>Chargement...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analyses des événements</h1>
      <div className="flex justify-between items-center mb-6">
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={(range) => setDateRange({ from: range.from as Date, to: range.to as Date })}
        />
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par événement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les événements</SelectItem>
            {/* Add dynamic event options here */}
          </SelectContent>
        </Select>
        <Button onClick={handleExportData}>Exporter les données</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Ventes de billets par type</h2>
          <BarChart data={analyticsData.ticketSales} />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Revenus au fil du temps</h2>
          <LineChart data={analyticsData.revenueOverTime} />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Démographie du public</h2>
          <PieChart data={analyticsData.audienceDemographics} />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top 5 des événements</h2>
          <ul>
            {analyticsData.topEvents.map((event, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{event.name}</span>
                <br />
                Billets vendus: {event.ticketsSold} | Revenus: {event.revenue.toFixed(2)} €
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

