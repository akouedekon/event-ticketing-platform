import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarList,
  SidebarListItem,
  SidebarListItemLink,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ORGANIZER") {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="w-64">
        <SidebarHeader>
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Organisateur</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarList>
            <SidebarListItem>
              <SidebarListItemLink href="/organizer/dashboard">Tableau de bord</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/organizer/events">Mes événements</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/organizer/tickets">Gestion des billets</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/organizer/analytics">Analyses</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/organizer/sales">Ventes</SidebarListItemLink>
            </SidebarListItem>
          </SidebarList>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <Link href="/auth/signout">
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                Déconnexion
              </button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

