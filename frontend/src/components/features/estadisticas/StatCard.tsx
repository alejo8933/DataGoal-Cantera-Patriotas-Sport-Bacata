import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: ReactNode
  subtitle?: ReactNode
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
      <h3 className="text-gray-500 text-sm font-medium mb-4">{title}</h3>
      <div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && <div className="text-gray-500 text-sm">{subtitle}</div>}
      </div>
    </div>
  )
}
