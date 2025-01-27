"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useNotification } from "@/contexts/NotificationContext"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const t = useTranslations("auth")
  const { addNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    if (result?.ok) {
      addNotification(t("loginSuccess"), "success")
      router.push("/")
    } else {
      addNotification(t("loginError"), "error")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">{t("signIn")}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t("signIn")}
          </Button>
        </form>
        <div className="mt-4">
          <Button onClick={() => signIn("google")} variant="outline" className="w-full mb-2">
            {t("signInWithGoogle")}
          </Button>
          <Button onClick={() => signIn("facebook")} variant="outline" className="w-full">
            {t("signInWithFacebook")}
          </Button>
        </div>
      </Card>
    </div>
  )
}

