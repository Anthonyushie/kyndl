"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

/**
 * Blocks access on devices with a physical screen width below the threshold.
 * `screen.width` reports the hardware display size and is NOT affected by
 * the browser's "Request Desktop Site" toggle, unlike the viewport meta tag
 * or `window.innerWidth`.
 */
const MIN_SCREEN_WIDTH = 1024

export function DesktopOnlyGate() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    function check() {
      const sw = screen.width
      const sh = screen.height
      const minDim = Math.min(sw, sh)

      // Block only if the physical screen's smallest dimension is below threshold
      // screen.width/height report hardware pixels — unaffected by "desktop mode"
      if (minDim < MIN_SCREEN_WIDTH) {
        setBlocked(true)
      } else {
        setBlocked(false)
      }
    }

    check()

    // Re-check on orientation change (mobile rotation)
    window.addEventListener("orientationchange", check)
    window.addEventListener("resize", check)

    return () => {
      window.removeEventListener("orientationchange", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  if (!blocked) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        // Prevent any scrolling or interaction behind
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <Image
        src="/images/kyndl_logo.png"
        alt="Kyndl"
        width={140}
        height={34}
        style={{ marginBottom: "2rem", opacity: 0.9 }}
      />
      <h1
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: 700,
          lineHeight: 1.3,
          marginBottom: "1rem",
          maxWidth: "360px",
        }}
      >
        Desktop Only
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          maxWidth: "340px",
        }}
      >
        Kyndl is optimised for desktop screens. Please visit on a laptop or
        desktop computer for the full experience.
      </p>
      <div
        style={{
          marginTop: "2rem",
          width: "48px",
          height: "4px",
          borderRadius: "2px",
          background: "#ff364d",
        }}
      />
    </div>
  )
}
