"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()
  const t = useTranslations("common")
  const { data: session } = useSession()

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("events") },
    { href: "/recommendations", label: t("recommendations") },
    ...(session?.user.role === "ORGANIZER"
      ? [
          { href: "/organizer/dashboard", label: t("dashboard") },
          { href: "/organizer/events", label: t("myEvents") },
          { href: "/organizer/reports", label: t("reports") },
        ]
      : []),
    { href: "/support", label: t("support") },
  ]

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                TicketPro
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <>
                <Link href="/create-ticket">
                  <Button variant="outline" className="mr-4">
                    {t("createTicket")}
                  </Button>
                </Link>
                <Button onClick={() => signOut()} variant="ghost">
                  {t("logout")}
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

