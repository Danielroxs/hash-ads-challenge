import { Skeleton } from '@/components/ui/skeleton'

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {['Campaña', 'Plataforma', 'Estado', 'Gasto / Budget', 'ROAS', 'Impresiones', 'Clicks', 'CTR'].map(
              (col) => (
                <th key={col} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-36 mb-1.5" />
                <Skeleton className="h-3 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-24 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20 ml-auto mb-1.5" />
                <Skeleton className="h-1 w-24 ml-auto" />
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
    <>
      <div className="hidden md:block">
        <TableSkeleton />
      </div>
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}