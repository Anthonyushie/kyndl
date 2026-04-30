"use client"

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import "@rainbow-me/rainbowkit/styles.css"
import { useState, type ReactNode } from "react"
import { defineChain } from "viem"

// Define Mezo Testnet chain manually — the @mezo-org/passport package has
// a broken re-export chain through @mezo-org/orangekit that fails under
// Next.js Turbopack. These values come directly from the Mezo docs.
export const mezoTestnet = defineChain({
  id: 31611,
  name: "Mezo Testnet",
  network: "mezo-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bitcoin",
    symbol: "BTC",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.test.mezo.org"],
      webSocket: ["wss://rpc-ws.test.mezo.org"],
    },
    default: {
      http: ["https://rpc.test.mezo.org"],
      webSocket: ["wss://rpc-ws.test.mezo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mezo Testnet Explorer",
      url: "https://explorer.test.mezo.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 3669328,
    },
  },
  testnet: true,
})

// Use RainbowKit's getDefaultConfig directly instead of @mezo-org/passport's
// getConfig to avoid the broken orangekit dependency chain
const wagmiConfig = getDefaultConfig({
  appName: "Kyndl",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [mezoTestnet],
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
