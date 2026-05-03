import Link from "next/link"
import { ArrowRight, Orbit, Sparkles, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AppEntryPage() {
  return (
    <div className="relative min-h-[720px] overflow-hidden rounded-[36px] border border-white/6 bg-[linear-gradient(180deg,rgba(8,4,15,0.92),rgba(7,4,11,0.98))] px-6 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-8 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(165,118,255,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[12%] top-[18%] text-[72px] font-bold tracking-tight text-white/6 blur-[3px] sm:text-[112px] lg:text-[148px]">
        Every wallet
      </div>
      <div className="pointer-events-none absolute left-[12%] top-[38%] text-[72px] font-bold tracking-tight text-[#a576ff]/12 blur-[3px] sm:text-[112px] lg:text-[148px]">
        becomes sales
      </div>
      <div className="pointer-events-none absolute left-[12%] top-[56%] text-[72px] font-bold tracking-tight text-white/6 blur-[3px] sm:text-[112px] lg:text-[148px]">
        infrastructure.
      </div>

      <div className="relative z-10 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_380px]">
        <div className="flex max-w-3xl flex-col gap-6 pt-10 lg:pt-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Kyndl app</div>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Route demand.
            <span className="block text-[#ff364d] drop-shadow-[0_0_20px_rgba(255,54,77,0.35)]" style={{ fontFamily: "'Shadows Into Light Two', cursive" }}>
              Settle instantly.
            </span>
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Launch commission-ready campaigns, give every community member a trackable link, and keep purchase
            settlement visible from click to payout.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" className="px-6 py-6 text-base">
              <Link href="/app/create-campaign">Create Campaign</Link>
            </Button>
            <Button asChild variant="ghost" className="px-6 py-6 text-base">
              <Link href="/app/campaigns">
                Browse campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <AppMetric title="Hosted campaigns" value="Wallet-native" icon={Orbit} />
            <AppMetric title="Referral logic" value="Permissionless" icon={Sparkles} />
            <AppMetric title="Settlement" value="Instant state" icon={TrendingUp} />
          </div>
        </div>

        <div className="relative flex flex-col justify-end gap-4 xl:pt-10">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">Flight control</div>
            <div className="mt-4 grid gap-4">
              <div className="rounded-[22px] border border-white/8 bg-[#12071b] p-4">
                <div className="text-sm text-white/55">Campaign velocity</div>
                <div className="mt-2 text-3xl font-semibold text-white">+128%</div>
                <div className="mt-3 h-2 rounded-full bg-white/8">
                  <div className="h-2 w-[72%] rounded-full bg-[linear-gradient(90deg,#ff4d7a,#9f67ff)]" />
                </div>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm text-white/55">
                  <span>Top route</span>
                  <span className="rounded-full border border-[#ff4d7a]/30 bg-[#ff4d7a]/12 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-[#ff8ca4]">
                    live
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-white">Creator Pack 001</div>
                <div className="mt-1 text-sm text-white/55">24% commission • MUSD checkout • affiliate-ready</div>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,54,77,0.16),rgba(159,103,255,0.18))] p-5">
            <div className="text-sm font-semibold text-white">Build the funnel, not the friction.</div>
            <div className="mt-2 text-sm leading-6 text-white/65">
              Use the new workspace to publish campaigns faster, curate your library, and stage launch assets in one
              place.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppMetric({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: typeof Orbit
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="mt-3 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}
