"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccess({ params }: { params: { eventId: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/events/${params.eventId}/payment-status`)
        const data = await response.json()
        setIsSuccess(data.isPaid)
      } catch (error) {
        console.error("Failed to check payment status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkPaymentStatus()
  }, [params.eventId])

  if (isLoading) {
    return <div>Vérification du statut du paiement...</div>
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{isSuccess ? "Paiement réussi !" : "Échec du paiement"}</h1>
      <p className="mb-4">
        {isSuccess
          ? "Votre paiement a été traité avec succès. Votre événement est maintenant actif."
          : "Il semble y avoir eu un problème avec votre paiement. Veuillez réessayer."}
      </p>
      <Button onClick={() => router.push("/organizer/events")}>Retour à mes événements</Button>
    </Card>
  )
}

