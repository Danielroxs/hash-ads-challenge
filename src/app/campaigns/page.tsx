'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useDebounce } from '@/hooks/useDebounce'
import CampaignCard from '@/components/campaigns/CampaignCard'
import CampaignTable from '@/components/campaigns/CampaignTable'
import CampaignFilters from '@/components/campaigns/CampaignFilters'
import CampaignsSkeleton from '@/components/campaigns/CampaignsSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { staggerContainer, fadeIn } from '@/lib/animations'

function getPaginationPages(currentPage: number, totalPages: number): number[] {
  const windowSize = 10
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2))
  let end = start + windowSize - 1
  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - windowSize + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function CampaignsPage() {
  const {
    campaigns,
    totalCampaigns,
    currentPage,
    totalPages,
    filters,
    setPage,
    setPlatform,
    setStatus,
    setSearch: setSearchHook,
  } = useCampaigns()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    setSearchHook(debouncedSearch)
  }, [debouncedSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // En producción aquí vendría:
      // try { const data = await fetchCampaigns(); setCampaigns(data) }
      // catch { setHasError(true) }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 2xl:max-w-[1600px] min-[1920px]:max-w-[1800px] min-[2560px]:max-w-[2400px]">
      <div className="flex flex-1 flex-col">
      <motion.div className="mb-6" variants={fadeIn} initial="hidden" animate="visible">
        <h1 className="text-2xl font-semibold tracking-tight">Campañas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? (
            <span className="invisible">—</span>
          ) : (
            `${totalCampaigns} campaña${totalCampaigns !== 1 ? 's' : ''} encontrada${totalCampaigns !== 1 ? 's' : ''}`
          )}
        </p>
      </motion.div>

      <div className="mb-6">
        <CampaignFilters
          onSearchChange={setSearch}
          onPlatformChange={(v) => setPlatform(v as Parameters<typeof setPlatform>[0])}
          onStatusChange={(v) => setStatus(v as Parameters<typeof setStatus>[0])}
        />
      </div>

      <div className="flex flex-1 flex-col">
        {isLoading ? (
          <CampaignsSkeleton />
        ) : hasError ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(filters)}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {campaigns.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="hidden md:block">
                    <CampaignTable campaigns={campaigns} />
                  </div>

                  <motion.div
                    className="grid gap-3 md:hidden"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {campaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1 border-t border-border pt-4">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          {getPaginationPages(currentPage, totalPages).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`min-w-[36px] rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      </div>
    </main>
  )
}
