import React from "react"
import { render, screen } from "@testing-library/react"
import EventList from "@/components/EventList"

// Mock the useTranslations hook
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock the useState and useEffect hooks
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  useEffect: jest.fn(),
}))

describe("EventList", () => {
  const mockEvents = [
    {
      id: "1",
      title: "Test Event 1",
      date: "2023-07-15",
      location: "Test Location 1",
      image: "/test-image-1.jpg",
    },
    {
      id: "2",
      title: "Test Event 2",
      date: "2023-08-20",
      location: "Test Location 2",
      image: "/test-image-2.jpg",
    },
  ]

  beforeEach(() => {
    ;(React.useState as jest.Mock).mockImplementation(() => [mockEvents, jest.fn()])
  })

  it("renders the correct number of events", () => {
    render(<EventList />)
    const eventCards = screen.getAllByRole("article")
    expect(eventCards).toHaveLength(mockEvents.length)
  })

  it("displays the correct event information", () => {
    render(<EventList />)
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.title)).toBeInTheDocument()
      expect(screen.getByText(`event.date: ${new Date(event.date).toLocaleDateString()}`)).toBeInTheDocument()
      expect(screen.getByText(`event.location: ${event.location}`)).toBeInTheDocument()
    })
  })

  it("renders buy tickets buttons", () => {
    render(<EventList />)
    const buyTicketsButtons = screen.getAllByText("event.buyTickets")
    expect(buyTicketsButtons).toHaveLength(mockEvents.length)
  })
})

