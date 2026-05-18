'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { PlatformBadge, StatusBadge } from '@/components/ui/StatusBadge'
import { fadeInUp } from '@/lib/animations'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Campaign } from '@/types/campaign'

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const spendPercent = Math.min((campaign.spend / campaign.budget) * 100, 100)
  const barColor =
    campaign.status === 'ended'
      ? 'bg-zinc-400'
      : spendPercent < 70
        ? 'bg-blue-500'
        : spendPercent < 90
          ? 'bg-amber-500'
          : 'bg-red-500'

  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/campaigns/${campaign.id}`}>
        <Card className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]">
          <CardContent className="p-4">
            
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm leading-tight">
                  {campaign.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {campaign.client}
                </p>
              </div>
              <StatusBadge status={campaign.status} />
            </div>

            <div className="mt-3">
              <PlatformBadge platform={campaign.platform} />
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Presupuesto gastado</span>
                <span>
                  {formatCurrency(campaign.spend)} / {formatCurrency(campaign.budget)}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full transition-all ${barColor}`}
                  style={{ width: `${spendPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-border text-center">
              <div className="pr-2">
                <p className="text-xs text-muted-foreground">ROAS</p>
                <p className="text-sm font-semibold mt-0.5">{campaign.roas.toFixed(1)}x</p>
              </div>
              <div className="px-2">
                <p className="text-xs text-muted-foreground">Clicks</p>
                <p className="text-sm font-semibold mt-0.5">{formatNumber(campaign.clicks)}</p>
              </div>
              <div className="pl-2">
                <p className="text-xs text-muted-foreground">CTR</p>
                <p className="text-sm font-semibold mt-0.5">{campaign.ctr.toFixed(1)}%</p>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
