"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useInView } from "react-intersection-observer"

type Event = {
  id: string
  title: string
  date: string
  location: string
  image: string
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const t = useTranslations("event")
  const { ref, inView } = useInView()

  const fetchEvents = async () => {
    const res = await fetch(`/api/events?page=${page}`)
    const newEvents = await res.json()
    if (newEvents.length === 0) {
      setHasMore(false)
    } else {
      setEvents((prevEvents) => [...prevEvents, ...newEvents])
      setPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [page]) // Added page to dependencies

  useEffect(() => {
    if (inView && hasMore) {
      fetchEvents()
    }
  }, [inView, hasMore]) // Added hasMore to dependencies

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">
              {t("date")}: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-4">
              {t("location")}: {event.location}
            </p>
            <Link href={`/event/${event.id}`}>
              <Button className="w-full">{t("buyTickets")}</Button>
            </Link>
          </div>
        </Card>
      ))}
      {hasMore && <div ref={ref}>Loading more events...</div>}
    </div>
  )
}

