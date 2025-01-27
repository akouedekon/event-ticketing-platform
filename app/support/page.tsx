"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment puis-je créer un événement ?",
    answer:
      "Pour créer un événement, connectez-vous à votre compte organisateur, cliquez sur 'Créer un événement' et suivez les étapes pour remplir les détails de votre événement.",
  },
  {
    question: "Comment puis-je modifier les détails de mon billet ?",
    answer:
      "Vous pouvez modifier les détails de votre billet en accédant à la page de gestion de l'événement, en sélectionnant le type de billet que vous souhaitez modifier, et en cliquant sur 'Modifier'.",
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par carte bancaire (Visa, Mastercard) et par Mobile Money (MTN, Orange, Moov).",
  },
]

export default function Support() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement support ticket creation logic
    console.log("Creating support ticket:", { name, email, message })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Support client</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">FAQ</h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>
        <Card>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contactez-nous</h2>
            <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Textarea
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
            />
            <Button type="submit">Envoyer</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

