"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"

type Campaign = {
  id: string
  name: string
  type: string
  content: string
  targetAudience: string
}

export default function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState<Omit<Campaign, "id">>({
    name: "",
    type: "",
    content: "",
    targetAudience: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewCampaign((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const campaignWithId = { ...newCampaign, id: Date.now().toString() }
    setCampaigns((prev) => [...prev, campaignWithId])
    setNewCampaign({
      name: "",
      type: "",
      content: "",
      targetAudience: "",
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Campagnes marketing</h1>
      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="text-xl font-semibold mb-4">Créer une nouvelle campagne</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Nom de la campagne"
              value={newCampaign.name}
              onChange={handleInputChange}
              required
            />
            <Select name="type" value={newCampaign.type} onChange={handleInputChange} required>
              <option value="">Sélectionnez un type</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </Select>
            <Textarea
              name="content"
              placeholder="Contenu de la campagne"
              value={newCampaign.content}
              onChange={handleInputChange}
              required
              className="col-span-2"
            />
            <Input
              name="targetAudience"
              placeholder="Public cible"
              value={newCampaign.targetAudience}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="mt-4">
            Créer la campagne
          </Button>
        </form>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
            <p className="text-gray-600 mb-2">Type: {campaign.type}</p>
            <p className="text-gray-600 mb-2">Public cible: {campaign.targetAudience}</p>
            <p className="text-gray-700">{campaign.content}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

