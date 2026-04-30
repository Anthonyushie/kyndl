"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export function LogoMarquee() {
  const [pausedRow, setPausedRow] = useState<string | null>(null)

  const phrases = [
    "Permissionless",
    "MUSD-native",
    "Mezo Passport Verified",
    "Instant Settlement",
    "No Approval Needed",
    "Agentic-Ready",
    "Built on Bitcoin",
  ]

  const secondRowPhrases = [
    "Built on Bitcoin",
    "Agentic-Ready",
    "No Approval Needed",
    "Instant Settlement",
    "Mezo Passport Verified",
    "MUSD-native",
    "Permissionless",
  ]

  const TextCard = ({ text, rowId }: { text: string; rowId: string }) => (
    <div
      className="flex-shrink-0 mx-3"
      onMouseEnter={() => setPausedRow(rowId)}
      onMouseLeave={() => setPausedRow(null)}
    >
      <div className="h-20 sm:h-24 lg:h-28 px-10 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-xl flex items-center justify-center overflow-hidden">
        <Image src="/mezo-logo-inline.svg" alt="Mezo" width={220} height={40} className="h-10 sm:h-12 w-auto opacity-90" />
      </div>
    </div>
  )

  return (
    <section className="text-white py-16 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-12 sm:flex-row sm:items-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-center sm:text-left">
            The power of <span className="text-[#ff364d]" style={{ fontFamily: "'Shadows Into Light Two', cursive" }}>Bitcoin-native</span>
            <br />
            commerce
          </h2>
          <div className="mt-12 flex justify-center sm:justify-start">
            <Button asChild variant="ghost" className="mt-4 sm:mt-0">
              <Link href="#docs">View Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Logo Marquee */}
        <div className="relative">
          {/* First Row - Scrolling Right */}
          <div className="flex overflow-hidden mb-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className={`flex animate-scroll-right whitespace-nowrap`}
              style={{
                animationPlayState: pausedRow === "first" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {[...phrases, ...phrases, ...phrases].map((text, index) => (
                <TextCard key={`first-${index}`} text={text} rowId="first" />
              ))}
            </div>
          </div>

          {/* Second Row - Scrolling Left */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className={`flex animate-scroll-left whitespace-nowrap`}
              style={{
                animationPlayState: pausedRow === "second" ? "paused" : "running",
                width: "max-content",
              }}
            >
              {[...secondRowPhrases, ...secondRowPhrases, ...secondRowPhrases].map((text, index) => (
                <TextCard key={`second-${index}`} text={text} rowId="second" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
