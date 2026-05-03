"use client"

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  BadgeDollarSign,
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  Info,
  Link2,
  Loader2,
  PackageOpen,
  Sparkles,
  UploadCloud,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCreateCampaign } from "@/hooks/use-create-campaign"

export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { deploy, isDeploying } = useCreateCampaign()

  const [mode, setMode] = useState<"ai" | "upload">("upload")
  const [commission, setCommission] = useState([22])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("149")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    setCoverFile(file)
    const url = URL.createObjectURL(file)
    setCoverPreview(url)
  }, [])

  const clearCover = useCallback(() => {
    setCoverFile(null)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [coverPreview])

  const summary = useMemo(() => {
    const numericPrice = Number(price || 0)
    const affiliateCut = Number.isFinite(numericPrice) ? (numericPrice * commission[0]) / 100 : 0
    const creatorCut = Number.isFinite(numericPrice) ? numericPrice - affiliateCut : 0

    return {
      affiliateCut,
      creatorCut,
    }
  }, [commission, price])

  const handleDeploy = async () => {
    if (!name.trim()) {
      toast({ title: "Missing name", description: "Enter a campaign name before deploying.", variant: "destructive" })
      return
    }
    if (!price || Number(price) <= 0) {
      toast({ title: "Invalid price", description: "Set a valid MUSD price.", variant: "destructive" })
      return
    }

    try {
      const campaignAddress = await deploy({
        name: name.trim(),
        price,
        commission: commission[0],
        description,
        category: "Education / Premium download",
        slug,
        coverImage: coverFile,
      })

      if (campaignAddress) {
        toast({
          title: "Campaign deployed! 🎉",
          description: `${campaignAddress.slice(0, 6)}...${campaignAddress.slice(-4)} is live on Mezo.`,
        })
        router.push("/app/campaigns")
      } else {
        toast({ title: "Deployed", description: "Transaction confirmed but could not read campaign address." })
      }
    } catch (err) {
      toast({
        title: "Deployment failed",
        description: err instanceof Error ? err.message : "The transaction did not complete.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(28,9,12,0.96),rgba(18,5,8,0.94))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Campaign builder</div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Create a campaign that
            <span className="block text-[#ff364d]">looks ready to convert.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Shape the offer, tune the commission rail, and stage the visuals before the contract deployment flow is
            triggered.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-3">
            <StepMarker index={1} label="Create" active />
            <StepMarker index={2} label="Review" />
            <StepMarker index={3} label="Publish" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,10,12,0.96),rgba(12,7,9,0.96))] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-2xl font-bold text-white">Campaign Cover / Gallery</div>
                <div className="mt-2 text-sm text-white/55">Required for launch cards, shares, and checkout context.</div>
              </div>
              <div className="inline-flex rounded-full border border-white/10 bg-[#1a0a0d] p-1">
                <button
                  type="button"
                  onClick={() => setMode("ai")}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    mode === "ai" ? "bg-white text-[#13091d]" : "text-white/60"
                  }`}
                >
                  Create with AI
                </button>
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    mode === "upload" ? "bg-[linear-gradient(90deg,#ff364d,#ff6b7a)] text-white" : "text-white/60"
                  }`}
                >
                  Upload files
                </button>
              </div>
            </div>

            <div className="mt-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
                disabled={isDeploying}
              />
              {coverPreview ? (
                <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                  <img src={coverPreview} alt="Cover preview" className="h-56 w-full object-cover" />
                  <button
                    type="button"
                    onClick={clearCover}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm hover:bg-black/80 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                    {coverFile?.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-[28px] border border-dashed border-white/30 bg-black/15 px-6 py-12 text-center transition hover:border-[#ff364d]/50 hover:bg-black/25"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                    <UploadCloud className="h-7 w-7 text-[#ff364d]" />
                  </div>
                  <div className="mt-5 text-xl font-semibold text-white">Upload a cover image</div>
                  <div className="mt-2 text-sm leading-7 text-white/55">
                    Click to select campaign art, product screenshots, or social assets.
                  </div>
                </button>
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,10,31,0.96),rgba(12,7,20,0.96))] p-6">
            <div className="text-2xl font-bold text-white">Campaign Details</div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Campaign name" hint="Required">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Creator Growth Vault"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-white/30"
                  disabled={isDeploying}
                />
              </Field>
              <Field label="Price (MUSD)" hint="Checkout price">
                <Input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="149"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-white/30"
                  disabled={isDeploying}
                />
              </Field>
              <Field label="Custom URL" hint="Optional">
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder="creator-growth-vault"
                    className="h-12 rounded-2xl border-white/10 bg-black/20 pl-11 text-white placeholder:text-white/30"
                    disabled={isDeploying}
                  />
                </div>
              </Field>
              <Field label="Category" hint="Launch lane">
                <div className="flex h-12 items-center rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white/70">
                  Education / Premium download
                </div>
              </Field>
            </div>

            <Field label="Description" hint="What buyers receive">
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what the buyer gets, why the campaign converts, and what makes the referral spread worth sharing."
                className="mt-3 min-h-[180px] rounded-[24px] border-white/10 bg-black/20 text-white placeholder:text-white/30"
                disabled={isDeploying}
              />
            </Field>
          </section>

          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,10,31,0.96),rgba(12,7,20,0.96))] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-white">Distribution & payout</div>
                <div className="mt-2 text-sm text-white/55">Set the share split before deployment.</div>
              </div>
              <div className="rounded-full border border-[#ff4d7a]/25 bg-[#ff4d7a]/10 px-4 py-2 text-sm font-semibold text-[#ff9cb0]">
                {commission[0]}% affiliate
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Commission slider</span>
                <span>You keep {100 - commission[0]}%</span>
              </div>
              <Slider
                value={commission}
                onValueChange={setCommission}
                max={40}
                min={5}
                step={1}
                disabled={isDeploying}
                className="mt-6 [&_[role=slider]]:border-[#ff364d] [&_[role=slider]]:bg-[#ff364d] [&_[data-orientation=horizontal]>div]:bg-white/10 [&_[data-orientation=horizontal]>div>div]:bg-[linear-gradient(90deg,#ff364d,#ff6b7a)]"
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={BadgeDollarSign}
                title="Creator settlement"
                value={`${summary.creatorCut.toFixed(2)} MUSD`}
                copy="What the creator keeps per purchase before future protocol logic."
              />
              <InfoCard
                icon={Users}
                title="Affiliate settlement"
                value={`${summary.affiliateCut.toFixed(2)} MUSD`}
                copy="What routes instantly to the affiliate wallet with the current contract flow."
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,10,31,0.96),rgba(12,7,20,0.96))] p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl font-bold text-white">Deliverables</div>
              <div className="text-sm text-white/50">Up to 10 files</div>
            </div>
            <div className="mt-6 rounded-[28px] border border-dashed border-[#ff364d]/45 bg-[#120909] px-6 py-10 text-center">
              <PackageOpen className="mx-auto h-8 w-8 text-[#ff364d]" />
              <div className="mt-4 text-xl font-semibold text-white">Upload product files</div>
              <div className="mt-2 text-sm leading-7 text-white/55">
                Audio, video, docs, templates, PDFs, or source files that unlock after purchase.
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" className="justify-center px-6" disabled={isDeploying}>
              Previous
            </Button>
            <Button
              variant="accent"
              className="justify-center px-6"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deploying on-chain…
                </>
              ) : (
                <>
                  Review campaign
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(23,12,14,0.96),rgba(12,7,9,0.96))] p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Live preview</div>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
              <div className="h-44 bg-[radial-gradient(circle_at_top_left,rgba(255,54,77,0.45),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,107,122,0.25),transparent_28%),linear-gradient(135deg,#120808_0%,#1a0a0d_100%)] px-5 py-5">
                <div className="flex h-full items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">Campaign card</div>
                    <div className="mt-2 text-2xl font-bold text-white">{name || "Untitled campaign"}</div>
                    <div className="mt-2 text-sm text-white/60">{price || "0"} MUSD • {commission[0]}% commission</div>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/70">
                    Ready to route
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <PreviewRow label="Slug" value={slug || "Not set"} />
                <PreviewRow label="Affiliate payout" value={`${summary.affiliateCut.toFixed(2)} MUSD`} />
                <PreviewRow label="Creator payout" value={`${summary.creatorCut.toFixed(2)} MUSD`} />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6">
            <div className="text-lg font-semibold text-white">Checklist</div>
            <div className="mt-4 space-y-3">
              <ChecklistItem complete={name.length > 0} label="Campaign name added" />
              <ChecklistItem complete={description.length > 0} label="Description drafted" />
              <ChecklistItem complete={commission[0] >= 5} label="Commission split configured" />
              <ChecklistItem complete={price.length > 0} label="Price set in MUSD" />
            </div>
          </section>

          <section className="rounded-[32px] border border-white/8 bg-[linear-gradient(135deg,rgba(255,54,77,0.12),rgba(255,107,122,0.08))] p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <ImagePlus className="h-5 w-5 text-[#ff9cb0]" />
              Deploy info
            </div>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Clicking &ldquo;Review campaign&rdquo; will deploy your campaign on-chain via the KyndlRegistry contract on Mezo
              Testnet. Make sure your wallet is connected and has testnet funds.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint: string
  children: ReactNode
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span>{label}</span>
        <span className="text-white/35">{hint}</span>
      </div>
      {children}
    </div>
  )
}

function StepMarker({ index, label, active = false }: { index: number; label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border text-lg font-semibold ${
          active
            ? "border-[#ff364d] bg-[#ff364d] text-white"
            : "border-white/12 bg-white/[0.03] text-white/65"
        }`}
      >
        {index}
      </div>
      <div className={`text-sm ${active ? "text-white" : "text-white/55"}`}>{label}</div>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  value,
  copy,
}: {
  icon: typeof BadgeDollarSign
  title: string
  value: string
  copy: string
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff364d,#ff6b7a)]">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm text-white/55">{title}</div>
          <div className="mt-1 text-xl font-semibold text-white">{value}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/55">{copy}</p>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

function ChecklistItem({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <CheckCircle2 className={`h-4 w-4 ${complete ? "text-emerald-400" : "text-white/25"}`} />
      <span className={complete ? "text-sm text-white" : "text-sm text-white/55"}>{label}</span>
    </div>
  )
}
