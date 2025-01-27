"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ActionButtons } from "@/components/ui/action-buttons"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/NotificationContext"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [nameFilter, setNameFilter] = useState("")
  const [emailFilter, setEmailFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const router = useRouter()
  const { addNotification } = useNotification()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rôle",
    },
    {
      accessorKey: "createdAt",
      header: "Date d'inscription",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        return <ActionButtons onEdit={() => handleEdit(user.id)} onDelete={() => handleDelete(user.id)} />
      },
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        name: nameFilter,
        email: emailFilter,
        role: roleFilter,
      }).toString()
      const response = await fetch(`/api/admin/users?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      addNotification("Erreur lors du chargement des utilisateurs", "error")
    }
  }

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`)
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      setUsers(users.filter((user) => user.id !== userId))
      addNotification("Utilisateur supprimé avec succès", "success")
    } catch (error) {
      console.error("Error deleting user:", error)
      addNotification("Erreur lors de la suppression de l'utilisateur", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>
      <div className="mb-4 flex space-x-4">
        <Input placeholder="Filtrer par nom" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <Input placeholder="Filtrer par email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
            <SelectItem value="ORGANIZER">Organisateur</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setNameFilter("")
            setEmailFilter("")
            setRoleFilter("")
          }}
        >
          Réinitialiser les filtres
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

