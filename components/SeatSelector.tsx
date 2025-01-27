"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type Seat = {
  id: string
  row: string
  number: number
  isAvailable: boolean
}

type SeatSelectorProps = {
  eventId: string
  onSeatSelect: (seatId: string) => void
}

export function SeatSelector({ eventId, onSeatSelect }: SeatSelectorProps) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  useEffect(() => {
    const fetchSeats = async () => {
      const response = await fetch(`/api/events/${eventId}/seats`)
      const data = await response.json()
      setSeats(data)
    }
    fetchSeats()
  }, [eventId])

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId)
    onSeatSelect(seatId)
  }

  return (
    <div className="grid grid-cols-10 gap-2">
      {seats.map((seat) => (
        <Button
          key={seat.id}
          onClick={() => handleSeatClick(seat.id)}
          disabled={!seat.isAvailable}
          variant={selectedSeat === seat.id ? "default" : "outline"}
          className="w-10 h-10"
        >
          {seat.row}
          {seat.number}
        </Button>
      ))}
    </div>
  )
}

