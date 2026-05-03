import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Providers } from "@/components/providers"

const bodyFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-custom",
})

export const metadata: Metadata = {
  title: "Kyndl | Permissionless affiliate payouts. Onchain. Instant.",
  description:
    "Launch your affiliate program in seconds. Every commission settled in MUSD instantly.",
  generator: "v0.app",
}

import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProduction = process.env.NODE_ENV === "production"

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap" rel="stylesheet" />

        {/* Dynamic Favicon Script */}
        <Script id="dynamic-favicon" strategy="beforeInteractive">
          {`
            function updateFavicon() {
              const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const faviconHref = darkMode ? '/icons/skitbit-white.svg' : '/icons/favicon-dark.svg';
              let link = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = faviconHref;
            }
            updateFavicon();
            // Listen for changes in theme
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
          `}
        </Script>

        {isProduction ? (
          <>
            {/* Google Tag Manager (deferred) */}
            <Script id="gtm-script" strategy="lazyOnload">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
            </Script>

            {/* Google Analytics (deferred) */}
            <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
            <Script id="gtag-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-W6LV22900R');
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className={bodyFont.className}>
        <Suspense fallback={null}>
          <div className="fixed inset-0 z-0 bg-black">
            <Plasma color="#ff364d" speed={0.8} direction="forward" scale={1.5} opacity={0.4} mouseInteractive={true} />
          </div>
          <div className="relative z-10">
            <Providers>{children}</Providers>
          </div>
        </Suspense>

        {isProduction ? (
          <>
            {/* Vercel Speed Insights and Analytics components */}
            <SpeedInsights />
            <Analytics />
          </>
        ) : null}
        <Toaster />
      </body>
    </html>
  )
}
