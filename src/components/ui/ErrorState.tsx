'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  onRetry: () => void
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <AlertCircle className="h-10 w-10 text-destructive/60" />
      <p className="mt-4 text-sm font-medium">Error al cargar campañas</p>
      <p className="mt-1 text-xs text-muted-foreground">
        No pudimos conectar con el servidor.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:opacity-80"
      >
        Reintentar
      </button>
    </div>
  )
}
