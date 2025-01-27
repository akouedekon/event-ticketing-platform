"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ValidateTicket() {
  const [ticketCode, setTicketCode] = useState("")
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual ticket validation logic
    const isValid = Math.random() > 0.5 // Simulating validation
    setValidationResult({
      valid: isValid,
      message: isValid ? "Billet valide" : "Billet invalide ou déjà utilisé",
    })
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Validation des billets</h1>
      <Card>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Scannez ou entrez le code du billet"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Valider le billet
          </Button>
        </form>
      </Card>
      {validationResult && (
        <div
          className={`mt-4 p-4 rounded ${validationResult.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {validationResult.message}
        </div>
      )}
    </div>
  )
}

