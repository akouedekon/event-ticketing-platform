"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart } from "@/components/Charts"
import { useNotification } from "@/contexts/NotificationContext"

export default function Reports() {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedMetric, setSelectedMetric] = useState("sales")
  const { addNotification } = useNotification()

  // Ces données seraient normalement récupérées depuis une API
  const events = [
    { id: "1", name: "Concert de Rock" },
    { id: "2", name: "Conférence Tech" },
    { id: "3", name: "Festival de Jazz" },
  ]

  const metrics = [
    { value: "sales", label: "Ventes" },
    { value: "attendance", label: "Participation" },
    { value: "revenue", label: "Revenus" },
  ]

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: selectedMetric === "sales" ? "Ventes" : selectedMetric === "attendance" ? "Participation" : "Revenus",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  }

  const handleGenerateReport = () => {
    // Ici, vous généreriez normalement le rapport et le téléchargeriez
    addNotification("Rapport généré avec succès !", "success")
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rapports</h1>
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un événement" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une métrique" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport}>Générer le rapport</Button>
        </div>
        <div className="h-64">
          {selectedMetric === "revenue" ? <LineChart data={chartData} /> : <BarChart data={chartData} />}
        </div>
      </Card>
    </div>
  )
}

