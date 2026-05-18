import { Skeleton } from '@/components/ui/skeleton'

function TableSkeleton() {
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
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Skeleton className="h-[17px] w-36 mb-0.5" />
                <Skeleton className="h-3 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-6 w-24 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-4 py-3 text-right">
                <Skeleton className="h-5 w-20 ml-auto mb-1" />
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-1 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-10 ml-auto" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-12 ml-auto" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-12 ml-auto" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-10 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-24 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1">
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
      </div>
    </div>
  )
}

export default function CampaignsSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="hidden md:block">
        <TableSkeleton />
      </div>
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}