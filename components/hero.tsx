import { Button } from "@/components/ui/button"
import Image from "next/image"
import LazyVideo from "./lazy-video"

export function Hero() {
  const buttons = (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Button asChild variant="primary">
        <a href="#creator">Start as Creator</a>
      </Button>
      <Button asChild variant="ghost">
        <a href="#affiliate">Become an Affiliate</a>
      </Button>
    </div>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={160} height={36} className="h-9 w-auto" />
            <p className="sr-only">Kyndl</p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Permissionless affiliate payouts.</span>
            <span className="block text-[#ff364d] drop-shadow-[0_0_20px_rgba(255,54,77,0.35)]" style={{ fontFamily: "'Shadows Into Light Two', cursive" }}>Onchain. Instant.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-center text-sm text-white/80 sm:text-base mx-auto">
            Any creator. Any wallet. Every commission settled in MUSD the moment a sale happens. No delays. No middlemen. No approval gates.
          </p>
          <div className="mt-6 flex justify-center">{buttons}</div>

          {/* Phone grid mimic */}
          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {phoneData.map((p, i) => {
              const visibility = i <= 3 ? "block" : "hidden"

              return (
                <div key={i} className={visibility}>
                  <PhoneCard title={p.title} sub={p.sub} tone={p.tone} gradient={p.gradient} videoSrc={p.videoSrc} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  gradient?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <LazyVideo
          src={
            videoSrc ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label={`${title} - ${sub}`}
        />

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-white/90">{title}</div>
            <p className="text-xs text-white/70">{sub}</p>
            <div className="font-mono mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff364d]">
              {tone === "calm" ? "skitbit app" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Instant Settlement",
    sub: "Commissions split and paid in the same block as the purchase. No 30-day cycles. No minimums.",
    tone: "results",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
  },
  {
    title: "Permissionless",
    sub: "Any Mezo Passport wallet becomes an affiliate in seconds. No KYC. No approval. Infinite scale.",
    tone: "speed",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
  },
  {
    title: "Trustless",
    sub: "Referral data lives onchain. Immutable. Permanent. No disputes. No fraud.",
    tone: "social",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
  },
  {
    title: "MUSD Native",
    sub: "Every payment, payout, and commission settled in MUSD. Bitcoin-backed and instant.",
    tone: "standout",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  },
]
