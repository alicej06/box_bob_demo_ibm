'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Expand, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RfpOutput } from '@/lib/rfp-schema'
import { cn } from '@/lib/utils'

type Slide = RfpOutput['slides'][number]

const INK = '1B2A4A'
const HIGHLIGHT = 'F2C230'

function SlideCanvas({ slide, index, total, companyName }: { slide: Slide; index: number; total: number; companyName: string }) {
  const isCover = index === 0
  return (
    <div
      className={cn(
        'flex aspect-video w-full flex-col justify-between overflow-hidden p-[5%] @container',
        isCover ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground',
      )}
    >
      <div className="flex items-center justify-between font-mono text-[1.6cqw] uppercase tracking-widest opacity-70">
        <span>{companyName}</span>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {isCover ? (
        <div className="flex flex-col gap-[2cqw]">
          <span className="h-[0.8cqw] w-[12cqw] bg-accent" aria-hidden="true" />
          <h3 className="text-balance text-[5.5cqw] font-semibold leading-tight tracking-tight">{slide.title}</h3>
          {slide.bullets[0] && <p className="text-[2.2cqw] opacity-80">{slide.bullets[0]}</p>}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-[3cqw] pt-[3cqw]">
          <h3 className="text-balance text-[3.8cqw] font-semibold leading-tight tracking-tight">{slide.title}</h3>
          <ul className="flex flex-col gap-[1.6cqw]">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex gap-[1.5cqw] text-[2.1cqw] leading-snug">
                <span className="mt-[0.9cqw] size-[0.9cqw] shrink-0 bg-accent" aria-hidden="true" />
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function SlideDeck({ slides, title, companyName }: { slides: Slide[]; title: string; companyName: string }) {
  const [current, setCurrent] = useState(0)
  const [exporting, setExporting] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const total = slides.length
  const go = (i: number) => setCurrent(Math.max(0, Math.min(total - 1, i)))

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      go(current + 1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(current - 1)
    }
  }

  async function exportPptx() {
    setExporting(true)
    try {
      const { default: PptxGenJS } = await import('pptxgenjs')
      const pptx = new PptxGenJS()
      pptx.layout = 'LAYOUT_WIDE'
      pptx.title = title
      slides.forEach((s, i) => {
        const slide = pptx.addSlide()
        const cover = i === 0
        slide.background = { color: cover ? INK : 'FFFFFF' }
        const text = cover ? 'FFFFFF' : INK
        slide.addText(companyName.toUpperCase(), { x: 0.6, y: 0.35, w: 8, h: 0.4, fontSize: 11, color: text, fontFace: 'Courier New' })
        if (cover) {
          slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.0, w: 1.6, h: 0.1, fill: { color: HIGHLIGHT } })
          slide.addText(s.title, { x: 0.6, y: 3.2, w: 12, h: 1.8, fontSize: 40, bold: true, color: text })
          if (s.bullets[0]) slide.addText(s.bullets[0], { x: 0.6, y: 5.0, w: 12, h: 0.8, fontSize: 18, color: text })
        } else {
          slide.addText(s.title, { x: 0.6, y: 0.9, w: 12, h: 1, fontSize: 30, bold: true, color: text })
          slide.addText(
            s.bullets.map((b) => ({ text: b, options: { bullet: { code: '25A0' }, paraSpaceAfter: 12 } })),
            { x: 0.6, y: 2.1, w: 12, h: 4.8, fontSize: 18, color: text, valign: 'top' },
          )
        }
        slide.addNotes(s.speakerNotes)
      })
      await pptx.writeFile({ fileName: `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pptx` })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => stageRef.current?.requestFullscreen?.()}>
          <Expand aria-hidden="true" />
          Present
        </Button>
        <Button size="sm" onClick={exportPptx} disabled={exporting}>
          {exporting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
          PowerPoint
        </Button>
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={handleKey}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Slide ${current + 1} of ${total}. Use arrow keys to navigate.`}
        className="relative flex items-center justify-center overflow-hidden rounded-lg border border-border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:bg-foreground"
      >
        <div className="w-full [:fullscreen_&]:max-h-screen [:fullscreen_&]:max-w-[177.78vh]">
          <SlideCanvas slide={slides[current]} index={current} total={total} companyName={companyName} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="icon" onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous slide">
          <ChevronLeft />
        </Button>
        <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
          {current + 1} / {total}
        </p>
        <Button variant="outline" size="icon" onClick={() => go(current + 1)} disabled={current === total - 1} aria-label="Next slide">
          <ChevronRight />
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">Speaker notes</p>
        <p className="text-sm leading-relaxed">{slides[current].speakerNotes}</p>
      </div>

      <ol className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5" aria-label="All slides">
        {slides.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={i === current}
              className={cn(
                'block w-full overflow-hidden rounded-md border-2 transition-colors',
                i === current ? 'border-primary' : 'border-border hover:border-muted-foreground',
              )}
            >
              <SlideCanvas slide={s} index={i} total={total} companyName={companyName} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
