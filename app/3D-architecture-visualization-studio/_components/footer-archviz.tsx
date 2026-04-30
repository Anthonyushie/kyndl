"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LazyVideo from "@/components/lazy-video"
import Image from "next/image"

export function FooterArchviz() {
  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            variant="primary"
          >
            <a href="https://wa.link/65mf3i" target="_blank" rel="noopener noreferrer">
              Book a Free Consultation
            </a>
          </Button>
        </div>
      </div>

      {/* Teaser block */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-[#ff364d]">DESIGN BUY‑IN FASTER</p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Walk stakeholders through your space — before it's built
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Present options, gather timestamped feedback and reach approvals with walkthrough videos and stills.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay
                    loop
                    muted
                    playsInline
                    aria-label="ArchViz walkthrough preview"
                  />
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-[#ff364d]">ArchViz</div>
                      <p className="text-xs text-white/80">Sell the vision with visuals</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff364d]">
                        Walkthrough Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={120} height={28} className="h-7 w-auto" />
                <span className="sr-only">Kyndl ArchViz</span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">
                Photorealistic architecture visualization for launches, leasing and approvals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {["Services", "Pricing", "FAQ", "About"].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="hover:text-[#ff364d]">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Legal</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li>
                    <Link href="/revisions" className="hover:text-[#ff364d]">
                      Revision Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/t&c" className="hover:text-[#ff364d]">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>© 2025 — Skitbit International Uk</p>
            <div className="flex items-center gap-6">
              <a href="#services" className="hover:text-[#ff364d]">
                Services
              </a>
              <a href="#pricing" className="hover:text-[#ff364d]">
                Pricing
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
