import { Badge } from '@/components/ui/badge'
import { Platform, Status } from '@/types/campaign'

interface PlatformBadgeProps {
  platform: Platform
}

interface StatusBadgeProps {
  status: Status
}

const platformConfig: Record<Platform, { label: string; className: string }> = {
  google: {
    label: 'Google Ads',
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-950',
  },
  meta: {
    label: 'Meta Ads',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-950',
  },
  amazon: {
    label: 'Amazon Ads',
    className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-950',
  },
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: 'Activa',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-950',
  },
  paused: {
    label: 'Pausada',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-950',
  },
  ended: {
    label: 'Terminada',
    className: 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-800',
  },
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const config = platformConfig[platform]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
