import "./globals.css"
import { Inter } from "next/font/google"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { MainNav } from "@/components/MainNav"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "TicketPro - Plateforme de billetterie en ligne",
    template: "%s | TicketPro",
  },
  description: "Créez, gérez et vendez des billets pour vos événements",
  keywords: ["billetterie", "événements", "tickets", "concerts", "festivals"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://ticketpro.com",
    siteName: "TicketPro",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ticketpro",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-100">
            <MainNav />
            <main className="container mx-auto py-6 px-4">{children}</main>
          </div>
        </NotificationProvider>
      </body>
    </html>
  )
}

