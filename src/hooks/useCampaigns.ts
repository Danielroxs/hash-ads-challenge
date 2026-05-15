import { useState, useMemo } from 'react'
import { campaigns } from '@/data/campaigns.mock'
import { Campaign, Platform, Status } from '@/types/campaign'

interface Filters {
  platform: Platform | 'all'
  status: Status | 'all'
  search: string
}

export function useCampaigns() {
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    status: 'all',
    search: '',
  })

  const filtered = useMemo(() => {
    return campaigns.filter((campaign: Campaign) => {
      const matchesPlatform =
        filters.platform === 'all' || campaign.platform === filters.platform

      const matchesStatus =
        filters.status === 'all' || campaign.status === filters.status

      const matchesSearch =
        filters.search === '' ||
        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.client.toLowerCase().includes(filters.search.toLowerCase())

      return matchesPlatform && matchesStatus && matchesSearch
    })
  }, [filters])

  function setPlatform(platform: Filters['platform']) {
    setFilters((prev) => ({ ...prev, platform }))
  }

  function setStatus(status: Filters['status']) {
    setFilters((prev) => ({ ...prev, status }))
  }

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }))
  }

  return { campaigns: filtered, filters, setPlatform, setStatus, setSearch }
}
