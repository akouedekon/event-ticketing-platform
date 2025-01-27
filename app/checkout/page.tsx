"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement payment processing logic
    console.log("Processing payment:", { paymentMethod, cardNumber, expiryDate, cvv, mobileNumber })
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Paiement sécurisé</h1>
      <Card>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
              <option value="">Sélectionnez un mode de paiement</option>
              <option value="card">Carte bancaire</option>
              <option value="mobile_money">Mobile Money</option>
            </Select>
          </div>
          {paymentMethod === "card" && (
            <>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Numéro de carte"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 flex space-x-4">
                <Input
                  type="text"
                  placeholder="MM/AA"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
                <Input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
              </div>
            </>
          )}
          {paymentMethod === "mobile_money" && (
            <div className="mb-4">
              <Input
                type="tel"
                placeholder="Numéro de téléphone"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            Payer
          </Button>
        </form>
      </Card>
    </div>
  )
}

