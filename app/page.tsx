import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LogoMarquee } from "@/components/logo-marquee"
import { SettlementShowcase } from "@/components/settlement-showcase"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://kyndl.xyz/#launch",
    name: "Launch Affiliate Program",
    description: "Launch your affiliate program in seconds",
    url: "https://kyndl.xyz/#launch",
  }

  // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://kyndl.xyz/",
    name: "Kyndl | Permissionless affiliate payouts. Onchain. Instant.",
    description:
      "Any creator. Any wallet. Every commission settled in MUSD the moment a sale happens. No delays. No middlemen. No approval gates.",
    url: "https://kyndl.xyz/",
    mainEntity: {
      "@type": "Organization",
      name: "Kyndl",
      url: "https://kyndl.xyz",
      sameAs: [
        "https://twitter.com/kyndlxyz",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://theskitbit.com/#pricing",
        name: "Pricing Section",
        url: "https://theskitbit.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <div className="bg-[#0a0a0a] border-b border-white/10 text-center py-3 flex items-center justify-center gap-4">
          <span className="text-white/80 text-sm font-medium hidden sm:inline-block">Now live on Mezo Testnet</span>
          <Button asChild variant="accent">
            <Link href="#demo">Try the demo →</Link>
          </Button>
        </div>
        <SiteHeader />
        <Hero />
        <Features />
        <LogoMarquee />
        <SettlementShowcase />
        <Pricing />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
