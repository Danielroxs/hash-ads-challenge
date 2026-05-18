'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, RotateCcw } from 'lucide-react'

interface CampaignFiltersProps {
  onSearchChange: (value: string) => void
  onPlatformChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export default function CampaignFilters({
  onSearchChange,
  onPlatformChange,
  onStatusChange,
}: CampaignFiltersProps) {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')
  const [status, setStatus] = useState('all')

  const hasActiveFilters = search !== '' || platform !== 'all' || status !== 'all'

  function handleSearchChange(value: string) {
    setSearch(value)
    onSearchChange(value)
  }

  function handlePlatformChange(value: string) {
    setPlatform(value)
    onPlatformChange(value)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    onStatusChange(value)
  }

  function handleReset() {
    setSearch('')
    setPlatform('all')
    setStatus('all')
    onSearchChange('')
    onPlatformChange('all')
    onStatusChange('all')
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar campaña o cliente..."
          className="pl-9 cursor-text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Select value={platform} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-[160px] cursor-pointer">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent className="animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
            <SelectItem value="all">Todas las plataformas</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="amazon">Amazon Ads</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activa</SelectItem>
            <SelectItem value="paused">Pausada</SelectItem>
            <SelectItem value="ended">Terminada</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={handleReset}
          disabled={!hasActiveFilters}
          title="Limpiar filtros"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}