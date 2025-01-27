"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "@/components/ColorPicker"

export default function Branding() {
  const [branding, setBranding] = useState({
    logo: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "Arial",
    customCss: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBranding((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (color: string, type: "primaryColor" | "secondaryColor") => {
    setBranding((prev) => ({ ...prev, [type]: color }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement branding update logic
    console.log("Updating branding:", branding)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Personnalisation de la marque</h1>
      <Card>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <Input
              id="logo"
              name="logo"
              type="url"
              value={branding.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Couleur primaire
            </label>
            <ColorPicker color={branding.primaryColor} onChange={(color) => handleColorChange(color, "primaryColor")} />
          </div>
          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
              Couleur secondaire
            </label>
            <ColorPicker
              color={branding.secondaryColor}
              onChange={(color) => handleColorChange(color, "secondaryColor")}
            />
          </div>
          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
              Police de caractères
            </label>
            <Input
              id="fontFamily"
              name="fontFamily"
              value={branding.fontFamily}
              onChange={handleInputChange}
              placeholder="Arial, sans-serif"
            />
          </div>
          <div>
            <label htmlFor="customCss" className="block text-sm font-medium text-gray-700">
              CSS personnalisé
            </label>
            <Textarea
              id="customCss"
              name="customCss"
              value={branding.customCss}
              onChange={handleInputChange}
              placeholder="Ajoutez votre CSS personnalisé ici"
              rows={4}
            />
          </div>
          <Button type="submit">Enregistrer les modifications</Button>
        </form>
      </Card>
    </div>
  )
}

