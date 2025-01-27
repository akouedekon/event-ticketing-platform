"use client"

import { Card } from "@/components/ui/card"
import { BarChart, LineChart } from "@/components/Charts"

export default function OrganizerDashboard() {
  // Ces données seraient normalement récupérées depuis une API
  const stats = {
    totalEvents: 5,
    totalTicketsSold: 1200,
    totalRevenue: 25000,
  }

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Ventes mensuelles",
        data: [4000, 3000, 5000, 2000, 6000, 4000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const eventPerformanceData = {
    labels: ["Event A", "Event B", "Event C", "Event D", "Event E"],
    datasets: [
      {
        label: "Billets vendus",
        data: [300, 450, 200, 150, 100],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord de l'organisateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Total des événements</h2>
            <p className="text-3xl font-bold">{stats.totalEvents}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Billets vendus</h2>
            <p className="text-3xl font-bold">{stats.totalTicketsSold}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenus totaux</h2>
            <p className="text-3xl font-bold">{stats.totalRevenue} €</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Ventes mensuelles</h2>
            <BarChart data={salesData} />
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Performance des événements</h2>
            <LineChart data={eventPerformanceData} />
          </div>
        </Card>
      </div>
    </div>
  )
}

