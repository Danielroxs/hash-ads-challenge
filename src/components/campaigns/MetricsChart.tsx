'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DailyMetric } from '@/types/campaign'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface MetricsChartProps {
  data: DailyMetric[]
}

type MetricKey = 'spend' | 'clicks' | 'conversions'

const metrics: { key: MetricKey; label: string }[] = [
  { key: 'spend', label: 'Gasto' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'conversions', label: 'Conversiones' },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

function formatTooltipValue(value: number, key: MetricKey): string {
  if (key === 'spend') return `$${value.toLocaleString('es-MX')}`
  return value.toLocaleString('es-MX')
}

export default function MetricsChart({ data }: MetricsChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('spend')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const total = data.reduce((sum, d) => sum + d[activeMetric], 0)
  const totalFormatted =
    activeMetric === 'spend' ? formatCurrency(total) : formatNumber(total)

  const c = {
    stroke: isDark ? '#e4e4e7' : '#18181b',
    muted: isDark ? '#71717a' : '#71717a',
    grid: isDark ? '#27272a' : '#e4e4e7',
    border: isDark ? '#3f3f46' : '#e4e4e7',
    bg: isDark ? '#1c1c1e' : '#ffffff',
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Total del período</p>
          <p className="text-2xl font-semibold tracking-tight">{totalFormatted}</p>
        </div>
        <div className="flex gap-1">
          {metrics.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeMetric === key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c.stroke} stopOpacity={0.15} />
              <stop offset="95%" stopColor={c.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: c.muted }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: c.muted }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [
              formatTooltipValue(Number(value), activeMetric),
              metrics.find((m) => m.key === activeMetric)?.label,
            ]}
            labelFormatter={(label) => formatDate(String(label))}
            contentStyle={{
              border: `1px solid ${c.border}`,
              borderRadius: '8px',
              fontSize: '12px',
              backgroundColor: c.bg,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
          <Area
            type="monotone"
            dataKey={activeMetric}
            stroke={c.stroke}
            strokeWidth={2}
            fill="url(#metricGradient)"
            dot={false}
            activeDot={{ r: 4, fill: c.stroke }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
