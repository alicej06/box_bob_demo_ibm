import { cn } from '@/lib/utils'

export function BobMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <img src="/logos/ibm.svg" alt="IBM" className="h-[1em] w-auto" />
      <span className="font-semibold tracking-tight text-foreground">Bob</span>
    </span>
  )
}

export function BoxMark({ className }: { className?: string }) {
  return <img src="/logos/box.svg" alt="Box" className={cn('h-[1.4em] w-auto', className)} />
}

export function ConnectionHero() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center">
        <span className="flex h-14 items-center rounded-xl border border-border bg-card px-4 text-lg shadow-sm">
          <BobMark />
        </span>
        <span aria-hidden="true" className="relative mx-1 h-0.5 w-16 sm:w-28">
          <span className="absolute inset-0 origin-left animate-link-draw bg-[repeating-linear-gradient(90deg,var(--border)_0_6px,transparent_6px_10px)]" />
          <span className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 animate-link-pulse rounded-full bg-box shadow-[0_0_0_4px_color-mix(in_oklab,var(--box)_20%,transparent)]" />
        </span>
        <span className="flex h-14 items-center rounded-xl border border-border bg-card px-4 text-lg shadow-sm">
          <BoxMark />
        </span>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        Bob is connected to your Box
        <span aria-hidden="true">{'·'}</span>
        <span className="font-mono text-xs">2,481 files indexed</span>
      </p>
    </div>
  )
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <BobMark />
      <span aria-hidden="true" className="text-muted-foreground">
        {'×'}
      </span>
      <BoxMark />
    </span>
  )
}
