import { Card } from "@/components/ui/card"

type Stat = {
  label: string
  value: string | number
  change?: number
}

type DashboardStatsProps = {
  stats: Stat[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            {stat.change !== undefined && (
              <p className={`text-sm font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

