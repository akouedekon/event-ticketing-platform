import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const DynamicEventList = dynamic(() => import("@/components/EventList"), {
  loading: () => <p>Chargement des événements...</p>,
})

export default function Home() {
  const t = useTranslations("home")

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">{t("title")}</h1>
      <div className="max-w-md mx-auto">
        <Input type="text" placeholder={t("search")} className="mb-4" />
      </div>
      <DynamicEventList />
    </div>
  )
}

