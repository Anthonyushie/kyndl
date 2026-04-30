"use client"

import { useAccount, useDisconnect } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function PassportButton({ className }: { className?: string }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Not connected — show Launch App button that opens RainbowKit modal
  if (!isConnected) {
    return (
      <Button
        variant="primary"
        className={className}
        onClick={() => router.push("/app")}
      >
        Launch App
      </Button>
    )
  }

  // Connected — show address pill with dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 cursor-pointer ${className ?? ""}`}
      >
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span>{truncateAddress(address!)}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/15 bg-black/90 backdrop-blur-xl shadow-xl overflow-hidden z-50">
          <button
            onClick={() => {
              setDropdownOpen(false)
              router.push("/app")
            }}
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors"
          >
            Open App
          </button>
          <div className="border-t border-white/10" />
          <button
            onClick={() => {
              setDropdownOpen(false)
              router.push("/dashboard")
            }}
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors"
          >
            Go to Dashboard
          </button>
          <div className="border-t border-white/10" />
          <button
            onClick={() => {
              disconnect()
              setDropdownOpen(false)
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/10 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
