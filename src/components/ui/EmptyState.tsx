import { SearchX } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <SearchX className="h-10 w-10 text-muted-foreground/50" />
      <p className="mt-4 text-sm font-medium">Sin resultados</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Intenta cambiar los filtros o el término de búsqueda.
      </p>
    </div>
  )
}
