import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { GlobalSearch } from "@/components/admin/GlobalSearch"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSection,
  SidebarLabel,
  SidebarSeparator,
  SidebarList,
  SidebarListItem,
  SidebarListItemLink,
  SidebarListItemButton,
  SidebarListItemAction,
  SidebarListMoreButton,
  SidebarToggleButton,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="w-64">
        <SidebarHeader>
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
          </div>
          <GlobalSearch />
        </SidebarHeader>
        <SidebarContent>
          <SidebarList>
            <SidebarListItem>
              <SidebarListItemLink href="/admin">Tableau de bord</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/users">Utilisateurs</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/events">Événements</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/sales">Ventes</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/payments">Paiements</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/logs">Logs</SidebarListItemLink>
            </SidebarListItem>
            <SidebarListItem>
              <SidebarListItemLink href="/admin/settings">Paramètres</SidebarListItemLink>
            </SidebarListItem>
          </SidebarList>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

