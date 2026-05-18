import { useState, useMemo } from 'react'
import { campaigns } from '@/data/campaigns.mock'
import { Campaign, Platform, Status } from '@/types/campaign'

interface Filters {
  platform: Platform | 'all'
  status: Status | 'all'
  search: string
}

const PAGE_SIZE = 10

export function useCampaigns() {
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    status: 'all',
    search: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  function setPlatform(platform: Filters['platform']) {
    setFilters((prev) => ({ ...prev, platform }))
    setCurrentPage(1)
  }

  function setStatus(status: Filters['status']) {
    setFilters((prev) => ({ ...prev, status }))
    setCurrentPage(1)
  }

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }))
    setCurrentPage(1)
  }

  function setPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return {
    campaigns: paginated,
    totalCampaigns: filtered.length,
    currentPage,
    totalPages,
    filters,
    setPage,
    setPlatform,
    setStatus,
    setSearch,
  }
}