"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CircleDollarSign, Filter, Flame, LayoutGrid, Loader2, Search, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCampaigns, type Campaign } from "@/hooks/use-campaigns"

const tagOptions = ["Education", "Membership", "Video", "Services", "Crypto", "Tools", "Community"]

export default function CampaignsPage() {
  const { campaigns, isLoading } = useCampaigns()
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const q = query.length === 0 || c.name.toLowerCase().includes(query.toLowerCase()) || c.creator.toLowerCase().includes(query.toLowerCase())
      const t = activeTag === "All" || c.category === activeTag
      return q && t
    })
  }, [activeTag, query, campaigns])

  const activeCampaignCount = campaigns.filter((c) => c.active).length
  const settledVolume = campaigns.reduce((sum, c) => sum + c.totalVolume, 0)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(28,9,12,0.96),rgba(18,5,8,0.94))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Campaign network</div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Explore active Kyndl<span className="block text-[#ff364d]">distribution loops.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Browse launch-ready campaigns, inspect commission design, and open checkout pages.
              </p>
            </div>
            <div className="rounded-full border border-[#ff364d]/25 bg-[#1c0f0f] px-4 py-2 text-sm text-white/75">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />Mezo Testnet • Campaigns live
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_188px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns or creators..." className="h-14 rounded-2xl border-white/10 bg-[#1a0a0d] pl-12 text-white placeholder:text-white/35" />
            </div>
            <button className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[#1a0a0d] px-5 text-sm font-semibold text-white">
              <span className="flex items-center gap-2"><Filter className="h-4 w-4 text-white/55" />Sort by</span>
              <span className="text-white/45">Newest</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {["All", ...tagOptions].map((tag) => (
              <button key={tag} type="button" onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm transition ${activeTag === tag ? "border-[#ff364d] bg-[#ff364d] text-white" : "border-[#ff364d]/25 bg-[#1a0a0d] text-white/70 hover:border-white/20 hover:text-white"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : filtered.length === 0 ? (
            <EmptyState hasAnyCampaigns={campaigns.length > 0} />
          ) : (
            filtered.map((c, i) => <CampaignCard key={c.address} campaign={c} index={i} />)
          )}
        </div>

        <Sidebar activeCampaignCount={activeCampaignCount} settledVolume={settledVolume} />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(21,10,12,0.96),rgba(13,8,10,0.96))] px-6 py-16">
      <Loader2 className="h-8 w-8 animate-spin text-[#ff364d]" />
      <p className="text-sm text-white/55">Loading campaigns from Mezo…</p>
    </div>
  )
}

function EmptyState({ hasAnyCampaigns }: { hasAnyCampaigns: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(21,10,12,0.96),rgba(13,8,10,0.96))] px-6 py-16">
      <LayoutGrid className="h-8 w-8 text-white/25" />
      <p className="text-sm text-white/55">{hasAnyCampaigns ? "No campaigns match your search." : "No campaigns deployed yet. Create the first one!"}</p>
      {!hasAnyCampaigns && (
        <Button asChild variant="accent" className="mt-2"><Link href="/app/create-campaign">Create a campaign</Link></Button>
      )}
    </div>
  )
}

function CampaignCard({ campaign: c, index }: { campaign: Campaign; index: number }) {
  const accents = ["bg-[#ff364d]", "bg-[#ff6b7a]", "bg-[#ff9aa5]"]
  return (
    <article className="overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(21,10,12,0.96),rgba(13,8,10,0.96))] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
      {c.coverUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          <img src={c.coverUrl} alt={c.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,8,10,0.96)] via-transparent to-transparent" />
        </div>
      )}
      <div className="relative border-b border-white/6 px-6 py-6">
        <div className={`absolute inset-y-0 left-0 w-1 ${accents[index % 3]}`} />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {c.category && <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">{c.category}</span>}
              <span className="rounded-full border border-[#ff4d7a]/20 bg-[#ff4d7a]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#ff95a9]">{c.active ? "Live" : "Inactive"}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">{c.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">{c.description || c.metadataURI || "On-chain campaign on Mezo Testnet."}</p>
          </div>
          <Button asChild variant="ghost" className="self-start border-white/15 px-5">
            <Link href={`/buy/${c.address}`}>Open checkout<ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 px-6 py-6 md:grid-cols-4">
        <DataPill label="Creator" value={`${c.creator.slice(0, 6)}...${c.creator.slice(-4)}`} />
        <DataPill label="Price" value={`${c.price} MUSD`} />
        <DataPill label="Commission" value={`${c.commissionPercent}%`} />
        <DataPill label="Total sales" value={String(c.totalSales)} />
      </div>
    </article>
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

function Sidebar({ activeCampaignCount, settledVolume }: { activeCampaignCount: number; settledVolume: number }) {
  return (
    <div className="space-y-4">
      <section className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(23,12,14,0.96),rgba(12,7,9,0.96))] p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Snapshot</div>
        <div className="mt-5 grid gap-4">
          <SideStat icon={LayoutGrid} label="Active campaigns" value={String(activeCampaignCount)} accent="from-[#ff4d7a] to-[#ff8e66]" />
          <SideStat icon={Users} label="Live affiliates" value="—" accent="from-[#ff364d] to-[#ff6b7a]" />
          <SideStat icon={CircleDollarSign} label="Settled volume" value={`${settledVolume.toLocaleString()} MUSD`} accent="from-[#8bffb8] to-[#67d3ff]" />
        </div>
      </section>
      <section className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-white"><Flame className="h-4 w-4 text-[#ff9a62]" />Affiliate program</div>
        <p className="mt-3 text-sm leading-7 text-white/60">Quick-launch home for affiliates and top-performing commission routes once Passport verification is wired in.</p>
      </section>
      <section className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-white"><Sparkles className="h-4 w-4 text-[#ff364d]" />Checkout pages</div>
        <p className="mt-3 text-sm leading-7 text-white/60">Every campaign flows into the `/buy/[campaignId]` purchase page.</p>
        <Button asChild variant="accent" className="mt-5"><Link href="/app/create-campaign">Create a new campaign</Link></Button>
      </section>
    </div>
  )
}

function SideStat({ icon: Icon, label, value, accent }: { icon: typeof LayoutGrid; label: string; value: string; accent: string }) {
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
