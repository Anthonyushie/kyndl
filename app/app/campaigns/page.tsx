"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CircleDollarSign,
  Filter,
  Flame,
  LayoutGrid,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const tagOptions = ["Education", "Membership", "Video", "Services", "Crypto", "Tools", "Community"]

const campaigns = [
  {
    id: "camp-001",
    name: "Creator Growth Vault",
    creator: "0x7ce2...91af",
    tag: "Education",
    price: "149 MUSD",
    commission: "22%",
    status: "Live",
    affiliates: 126,
    earnings: "4,290 MUSD",
    blurb: "Swipe-ready growth kits, launch templates, and monetization scripts for creator teams.",
  },
  {
    id: "camp-002",
    name: "Signal Sprint Toolkit",
    creator: "0x56fb...4a9c",
    tag: "Tools",
    price: "79 MUSD",
    commission: "18%",
    status: "Drafting",
    affiliates: 41,
    earnings: "1,140 MUSD",
    blurb: "A compact toolkit for creators shipping campaigns, referral loops, and rapid-fire landing pages.",
  },
  {
    id: "camp-003",
    name: "Midnight Membership Drop",
    creator: "0x914e...20bd",
    tag: "Membership",
    price: "249 MUSD",
    commission: "30%",
    status: "High Velocity",
    affiliates: 208,
    earnings: "8,900 MUSD",
    blurb: "Limited member access with premium files, gated releases, and social-first launch assets.",
  },
]

export default function CampaignsPage() {
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesQuery =
        query.length === 0 ||
        campaign.name.toLowerCase().includes(query.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(query.toLowerCase())
      const matchesTag = activeTag === "All" || campaign.tag === activeTag

      return matchesQuery && matchesTag
    })
  }, [activeTag, query])

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,9,28,0.96),rgba(10,5,18,0.94))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Campaign network</div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Explore active Kyndl
                <span className="block text-[#c792ff]">distribution loops.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Browse launch-ready campaigns, inspect commission design, and stage checkout pages that feel closer to
                a premium product directory than a cold admin grid.
              </p>
            </div>

            <div className="rounded-full border border-[#8d61ff]/25 bg-[#1c0f2b] px-4 py-2 text-sm text-white/75">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Mezo Testnet • Campaigns live
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_188px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search campaigns or creators..."
                className="h-14 rounded-2xl border-white/10 bg-[#201133] pl-12 text-white placeholder:text-white/35"
              />
            </div>
            <button className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[#201133] px-5 text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/55" />
                Sort by
              </span>
              <span className="text-white/45">Newest</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {["All", ...tagOptions].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTag === tag
                    ? "border-[#b57cff] bg-[#b57cff] text-[#12091d]"
                    : "border-[#8d61ff]/25 bg-[#1b102b] text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {filteredCampaigns.map((campaign, index) => (
            <article
              key={campaign.id}
              className="overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(21,10,31,0.96),rgba(13,8,22,0.96))] shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
            >
              <div className="relative border-b border-white/6 px-6 py-6">
                <div
                  className={`absolute inset-y-0 left-0 w-1 ${
                    index === 0 ? "bg-[#ff4d7a]" : index === 1 ? "bg-[#8f67ff]" : "bg-[#ffba59]"
                  }`}
                />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                        {campaign.tag}
                      </span>
                      <span className="rounded-full border border-[#ff4d7a]/20 bg-[#ff4d7a]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#ff95a9]">
                        {campaign.status}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">{campaign.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">{campaign.blurb}</p>
                  </div>

                  <Button asChild variant="ghost" className="self-start border-white/15 px-5">
                    <Link href={`/buy/${campaign.id}`}>
                      Open checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 px-6 py-6 md:grid-cols-4">
                <DataPill label="Creator" value={campaign.creator} />
                <DataPill label="Price" value={campaign.price} />
                <DataPill label="Commission" value={campaign.commission} />
                <DataPill label="Affiliate count" value={String(campaign.affiliates)} />
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <section className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(23,12,36,0.96),rgba(12,7,20,0.96))] p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Snapshot</div>
            <div className="mt-5 grid gap-4">
              <SideStat icon={LayoutGrid} label="Active campaigns" value="24" accent="from-[#ff4d7a] to-[#ff8e66]" />
              <SideStat icon={Users} label="Live affiliates" value="612" accent="from-[#8f67ff] to-[#65a7ff]" />
              <SideStat icon={CircleDollarSign} label="Settled volume" value="12.4k MUSD" accent="from-[#8bffb8] to-[#67d3ff]" />
            </div>
          </section>

          <section id="affiliate-program" className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Flame className="h-4 w-4 text-[#ff9a62]" />
              Affiliate program
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Keep this panel as the quick-launch home for affiliates, featured links, and top-performing commission
              routes once Passport verification and analytics are wired in.
            </p>
          </section>

          <section id="checkout-pages" className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-[#c792ff]" />
              Checkout pages
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Every campaign here is structured to flow into the existing `/buy/[campaignId]` purchase page so the
              browse layer and the checkout layer feel connected.
            </p>
            <Button asChild variant="accent" className="mt-5">
              <Link href="/app/create-campaign">Create a new campaign</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-3 text-base font-semibold text-white">{value}</div>
    </div>
  )
}

function SideStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof LayoutGrid
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-white/55">{label}</div>
          <div className="mt-2 text-xl font-semibold text-white">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
          <Icon className="h-5 w-5 text-[#110818]" />
        </div>
      </div>
    </div>
  )
}
