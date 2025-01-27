"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useNotification } from "@/contexts/NotificationContext"

type GlobalSettings = {
  maxTicketsPerEvent: number
  allowMultipleTicketTypes: boolean
  enableMobileMoneyPayments: boolean
  enableCreditCardPayments: boolean
  defaultCurrency: string
}

export default function GlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>({
    maxTicketsPerEvent: 1000,
    allowMultipleTicketTypes: true,
    enableMobileMoneyPayments: true,
    enableCreditCardPayments: true,
    defaultCurrency: "EUR",
  })
  const { addNotification } = useNotification()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) {
        throw new Error("Failed to fetch settings")
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      addNotification("Erreur lors du chargement des paramètres", "error")
    }
  }

  const handleSettingChange = (setting: keyof GlobalSettings, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
      }

      addNotification("Paramètres mis à jour avec succès", "success")
    } catch (error) {
      console.error("Error updating settings:", error)
      addNotification("Erreur lors de la mise à jour des paramètres", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Paramètres globaux</h1>
      <Card>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block mb-2">Nombre maximum de billets par événement</label>
            <Input
              type="number"
              value={settings.maxTicketsPerEvent}
              onChange={(e) => handleSettingChange("maxTicketsPerEvent", Number.parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <Checkbox
                checked={settings.allowMultipleTicketTypes}
                onCheckedChange={(checked) => handleSettingChange("allowMultipleTicketTypes", checked as boolean)}
              />
              <span className="ml-2">Autoriser plusieurs types de billets par événement</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <Checkbox
                checked={settings.enableMobileMoneyPayments}
                onCheckedChange={(checked) => handleSettingChange("enableMobileMoneyPayments", checked as boolean)}
              />
              <span className="ml-2">Activer les paiements par Mobile Money</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <Checkbox
                checked={settings.enableCreditCardPayments}
                onCheckedChange={(checked) => handleSettingChange("enableCreditCardPayments", checked as boolean)}
              />
              <span className="ml-2">Activer les paiements par carte de crédit</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Devise par défaut</label>
            <Input
              type="text"
              value={settings.defaultCurrency}
              onChange={(e) => handleSettingChange("defaultCurrency", e.target.value)}
            />
          </div>
          <Button type="submit">Enregistrer les paramètres</Button>
        </form>
      </Card>
    </div>
  )
}

