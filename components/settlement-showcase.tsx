import { CheckCircle2 } from "lucide-react"

type ReceiptItem = {
  label: string
  title: string
  amount: string
  currency: string
  meta: string
  lines: Array<{
    badge: string
    name: string
    detail: string
    value: string
    accent?: boolean
  }>
  footerLeft: string
  footerRight: string
  footerTone?: "green" | "violet"
}

const receipts: ReceiptItem[] = [
  {
    label: "Kyndl · Receipt",
    title: "Intro to DeFi · course",
    amount: "$149.00",
    currency: "USD",
    meta: "sold by @ana.mora · bound to @kai",
    lines: [
      { badge: "AN", name: "Ana · seller", detail: "65% payout", value: "$96.85" },
      { badge: "KT", name: "Kai · affiliate", detail: "32% commission", value: "$47.68" },
      { badge: "KY", name: "Kyndl · infra", detail: "3% flat", value: "$4.47", accent: true },
    ],
    footerLeft: "Receipt · 287,104,921",
    footerRight: "Attribution bound",
    footerTone: "green",
  },
  {
    label: "Kyndl · Receipt",
    title: "Notion OS for Founders · template",
    amount: "$49.00",
    currency: "USD",
    meta: "sold direct · no affiliate",
    lines: [
      { badge: "DN", name: "Dana · seller", detail: "97% payout", value: "$47.53" },
      { badge: "KY", name: "Kyndl · infra", detail: "3% flat", value: "$1.47", accent: true },
    ],
    footerLeft: "Receipt · 287,105,113",
    footerRight: "Direct sale",
    footerTone: "violet",
  },
  {
    label: "Kyndl · Receipt",
    title: "Cohort · signals alpha group",
    amount: "$420.00",
    currency: "USD",
    meta: "sold by @sara · bound to @noa + @paz",
    lines: [
      { badge: "SJ", name: "Sara · seller", detail: "60% payout", value: "$252.00" },
      { badge: "NK", name: "Noa · primary aff.", detail: "25%", value: "$105.00" },
      { badge: "PZ", name: "Paz · second aff.", detail: "12%", value: "$50.40" },
      { badge: "KY", name: "Kyndl · infra", detail: "3% flat", value: "$12.60", accent: true },
    ],
    footerLeft: "Receipt · 287,105,904",
    footerRight: "Multi-party bound",
    footerTone: "green",
  },
]

export function SettlementShowcase() {
  return (
    <section id="settlement" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Sample Receipts</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Settlement lands like
            <span
              className="block text-[#ff364d] drop-shadow-[0_0_20px_rgba(255,54,77,0.35)]"
              style={{ fontFamily: "'Shadows Into Light Two', cursive" }}
            >
              this.
            </span>
            <span className="block">Every time.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            Every Kyndl receipt shows who sold, who referred, and how the split resolved. Clean enough for buyers to trust,
            precise enough for creators and affiliates to verify at a glance.
          </p>
        </div>

        <div className="font-mono rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
          Visible split logic
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {receipts.map((receipt) => (
          <ReceiptCard key={`${receipt.title}-${receipt.footerLeft}`} receipt={receipt} />
        ))}
      </div>
    </section>
  )
}

function ReceiptCard({ receipt }: { receipt: ReceiptItem }) {
  const footerToneClass =
    receipt.footerTone === "green"
      ? "bg-[#dff8ea] text-[#15924c]"
      : "bg-[#efe5ff] text-[#8d5cff]"

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/12 bg-[#050505] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1.5">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{receipt.label}</p>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#dff8ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#15924c]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Settled
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <p className="text-sm text-white/70">{receipt.title}</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-5xl font-extrabold tracking-tight">{receipt.amount}</span>
          <span className="pb-1 text-xs uppercase tracking-[0.2em] text-white/45">{receipt.currency}</span>
        </div>
        <p className="font-mono mt-2 text-xs uppercase tracking-[0.16em] text-white/45">{receipt.meta}</p>

        <div className="mt-6 space-y-3">
          {receipt.lines.map((line) => (
            <div key={`${line.name}-${line.value}`} className="flex items-start justify-between gap-3 border-t border-dashed border-white/12 pt-3 first:border-t-0 first:pt-0">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#7a57dc] text-[10px] font-bold text-white">
                  {line.badge}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{line.name}</div>
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-white/45">{line.detail}</div>
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-white">
                {line.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{receipt.footerLeft}</span>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${footerToneClass}`}>
          {receipt.footerRight}
        </span>
      </div>
    </article>
  )
}
