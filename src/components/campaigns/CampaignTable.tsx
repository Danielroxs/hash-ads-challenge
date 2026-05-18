'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlatformBadge, StatusBadge } from '@/components/ui/StatusBadge'
import { scaleIn, staggerContainer } from '@/lib/animations'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Campaign } from '@/types/campaign'

interface CampaignTableProps {
  campaigns: Campaign[]
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="w-[26%] px-4 py-3 text-left font-medium text-muted-foreground">Campaña</th>
            <th className="w-[13%] px-4 py-3 text-left font-medium text-muted-foreground">Plataforma</th>
            <th className="w-[10%] px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
            <th className="w-[18%] px-4 py-3 text-right font-medium text-muted-foreground">Gasto / Presupuesto</th>
            <th className="w-[8%] px-4 py-3 text-right font-medium text-muted-foreground">ROAS</th>
            <th className="w-[11%] px-4 py-3 text-right font-medium text-muted-foreground">Impresiones</th>
            <th className="w-[8%] px-4 py-3 text-right font-medium text-muted-foreground">Clicks</th>
            <th className="w-[6%] px-4 py-3 text-right font-medium text-muted-foreground">CTR</th>
          </tr>
        </thead>
        <motion.tbody
          variants={staggerContainer}
          initial="hidden"
          animate="visible">
            
          {campaigns.map((campaign) => {
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
              <motion.tr
                key={campaign.id}
                variants={scaleIn}
                className="border-b border-border border-l-2 border-l-transparent last:border-0 hover:bg-muted/40 hover:border-l-foreground transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    <p className="font-medium leading-tight">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{campaign.client}</p>
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    <PlatformBadge platform={campaign.platform} />
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    <StatusBadge status={campaign.status} />
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block text-right">
                    <p className="font-medium">{formatCurrency(campaign.spend)}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <div className="h-1 w-16 rounded-full bg-muted">
                        <div
                          className={`h-1 rounded-full ${barColor}`}
                          style={{ width: `${spendPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(campaign.budget)}
                      </p>
                    </div>
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block text-right font-medium">
                    {campaign.roas.toFixed(1)}x
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block text-right text-muted-foreground">
                    {formatNumber(campaign.impressions)}
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block text-right text-muted-foreground">
                    {formatNumber(campaign.clicks)}
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Link href={`/campaigns/${campaign.id}`} className="block text-right text-muted-foreground">
                    {campaign.ctr.toFixed(1)}%
                  </Link>
                </td>

              </motion.tr>
            )
          })}
        </motion.tbody>
      </table>
    </div>
  )
}
