"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Twitter, Github } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Kyndl is built natively on Mezo — the Bitcoin banking layer. Payments settle in MUSD, Mezo's Bitcoin-backed stablecoin. Affiliate identity verified by Mezo Passport. No bridges. No foreign tokens. Pure Bitcoin-native commerce.",
  copyright: "Kyndl · Built on Mezo · Powered by MUSD · @Kyndlxyz",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            variant="primary"
          >
            <Link href="#launch">
              Get Started
            </Link>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="font-mono mb-2 text-[11px] tracking-widest text-[#ff364d]">GROWTH ENGINE</p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Your audience is your distribution.
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Launch your affiliate program in one transaction.
              </p>
              <div className="mt-6">
                <Button asChild variant="primary">
                  <Link href="#launch">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
                  {/* Lazy-loaded video fills the screen */}
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="Skitbit app preview - approvals made easy"
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-[#ff364d]">Agentic-Ready</div>
                      <p className="text-xs text-white/80">Built for a permissionless future</p>
                      <div className="font-mono mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff364d]">
                        Zero Hassle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={120} height={28} className="h-7 w-auto" />
                <span className="sr-only">Kyndl</span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="font-mono mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {["Home", "Features", "Testimonials", "Pricing", "Blog", "Download"].map((item) => (
                    <li key={item}>
                      <Link href={`#${item.toLowerCase()}`} className="hover:text-[#ff364d]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-mono mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Social media</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-neutral-400" />
                    <a
                      href="https://twitter.com/theskitbit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff364d]"
                      aria-label="Follow skitbit on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/kyndlxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#ff364d]"
                aria-label="View Kyndl on GitHub"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <Link href="/revisions" className="hover:text-[#ff364d]">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-[#ff364d]">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
