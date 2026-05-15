export type Platform = 'google' | 'meta' | 'amazon'

export type Status = 'active' | 'paused' | 'ended'

export interface DailyMetric {
  date: string
  spend: number
  clicks: number
  impressions: number
  conversions: number
}

export interface Campaign {
  id: string
  name: string
  client: string
  platform: Platform
  status: Status
  budget: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
  startDate: string
  endDate: string
  dailyMetrics: DailyMetric[]
}
