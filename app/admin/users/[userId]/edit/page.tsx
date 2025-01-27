"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/NotificationContext"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function EditUserPage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { addNotification } = useNotification()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
        addNotification("Erreur lors du chargement de l'utilisateur", "error")
      }
    }

    fetchUser()
  }, [params.userId, addNotification]) // Added addNotification to dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch(`/api/admin/users/${params.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      addNotification("Utilisateur mis à jour avec succès", "success")
      router.push("/admin/users")
    } catch (error) {
      console.error("Error updating user:", error)
      addNotification("Erreur lors de la mise à jour de l'utilisateur", "error")
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l'utilisateur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Rôle
          </label>
          <Select value={user.role} onValueChange={(value) => setUser({ ...user, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Utilisateur</SelectItem>
              <SelectItem value="ORGANIZER">Organisateur</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Mettre à jour</Button>
      </form>
    </Card>
  )
}

