'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  MousePointerClick,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  Wallet,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PlatformBadge, StatusBadge } from '@/components/ui/StatusBadge'
import MetricsChart from '@/components/campaigns/MetricsChart'
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations'
import { formatCurrency, formatCurrencyDecimal, formatNumber } from '@/lib/utils'
import { campaigns } from '@/data/campaigns.mock'

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type Performance = 'good' | 'medium' | 'bad' | 'neutral'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  performance?: Performance
  icon?: React.ReactNode
  hint?: string
}

const performanceClass: Record<Performance, string> = {
  good:    'text-emerald-600 dark:text-emerald-400',
  medium:  'text-amber-600 dark:text-amber-400',
  bad:     'text-red-600 dark:text-red-400',
  neutral: 'text-foreground',
}

function StatCard({ label, value, sub, performance = 'neutral', icon, hint }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Card className="transition-all duration-200 hover:shadow-md hover:border-foreground/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              {hint && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border border-border">
                    <p className="text-xs max-w-[200px]">{hint}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {icon && <span className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
          </div>
          <p className={`mt-1 text-xl font-semibold tracking-tight ${performanceClass[performance]}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const campaign = campaigns.find((c) => c.id === id)

  if (!campaign) notFound()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const spendPercent = Math.min((campaign.spend / campaign.budget) * 100, 100)
  const barColor =
    campaign.status === 'ended'
      ? 'bg-zinc-400'
      : spendPercent < 70
        ? 'bg-blue-500'
        : spendPercent < 90
          ? 'bg-amber-500'
          : 'bg-red-500'

  const roasPerf: Performance = campaign.roas > 3   ? 'good' : campaign.roas >= 1.5 ? 'medium' : 'bad'
  const ctrPerf: Performance  = campaign.ctr > 2   ? 'good' : campaign.ctr >= 0.8  ? 'medium' : 'bad'
  const cpcPerf: Performance  = campaign.cpc < 1   ? 'good' : campaign.cpc <= 3    ? 'medium' : 'bad'

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <TooltipProvider>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a campañas
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={fadeInUp}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{campaign.client}</p>
            </div>
            <div className="flex gap-2">
              <PlatformBadge platform={campaign.platform} />
              <StatusBadge status={campaign.status} />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Presupuesto ejecutado</span>
              <span>
                {formatCurrency(campaign.spend)} de {formatCurrency(campaign.budget)} ({spendPercent.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full transition-all ${barColor}`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatDisplayDate(campaign.startDate)}</span>
              <span>{formatDisplayDate(campaign.endDate)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="ROAS"
            value={`${campaign.roas.toFixed(1)}x`}
            sub="Retorno sobre inversión"
            performance={roasPerf}
            icon={<TrendingUp />}
            hint="Retorno por cada dólar invertido en publicidad. Un ROAS de 4x significa $4 de ingreso por cada $1 gastado."
          />
          <StatCard
            label="CTR"
            value={`${campaign.ctr.toFixed(1)}%`}
            sub="Tasa de clics"
            performance={ctrPerf}
            icon={<MousePointerClick />}
            hint="Porcentaje de personas que hicieron clic al ver el anuncio. Un CTR alto indica que el anuncio es relevante."
          />
          <StatCard
            label="CPC"
            value={formatCurrencyDecimal(campaign.cpc)}
            sub="Costo por clic"
            performance={cpcPerf}
            icon={<DollarSign />}
            hint="Costo promedio por cada clic recibido. Menor CPC significa más eficiencia en el gasto."
          />
          <StatCard
            label="Conversiones"
            value={formatNumber(campaign.conversions)}
            sub={`${formatCurrency(campaign.spend / campaign.conversions)} por conversión`}
            icon={<Target />}
            hint="Número de usuarios que completaron la acción deseada: compra, registro o descarga."
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Impresiones" value={formatNumber(campaign.impressions)} icon={<Eye />} />
          <StatCard label="Clicks" value={formatNumber(campaign.clicks)} icon={<MousePointer />} />
          <StatCard label="Gasto total" value={formatCurrency(campaign.spend)} icon={<Wallet />} />
        </div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Métricas diarias</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart data={campaign.dailyMetrics} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
    </TooltipProvider>
  )
}
