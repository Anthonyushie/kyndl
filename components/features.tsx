"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "A powerful network for both sides.",
  subtitle: "Everything you need to scale.",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Adaptability Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-white/20">
          <CardHeader>
            <p className="font-mono text-[11px] tracking-widest text-[#ff364d]">FOR CREATORS</p>
            <CardTitle className="mt-1 text-xl text-white">Deploy an affiliate program in one contract call</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm text-neutral-300 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> Set your own commission rate
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> Never manage payouts manually
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> Full analytics dashboard
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Client Love Card - Always visible */}
        <Card className="liquid-glass border border-white/20">
          <CardHeader>
            <p className="font-mono text-[11px] tracking-widest text-[#ff364d]">FOR AFFILIATES</p>
            <CardTitle className="mt-1 text-xl text-white">
              Generate a referral link from any wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm text-neutral-300 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> Earn MUSD commissions instantly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> Reputation grows via Mezo Passport
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff364d]">•</span> No minimum payout threshold
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
