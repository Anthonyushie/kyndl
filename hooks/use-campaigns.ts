"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { formatUnits, type Address } from "viem"
import { KYNDL_REGISTRY_ADDRESS, kyndlRegistryAbi } from "@/lib/contracts/kyndl"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export type Campaign = {
  address: Address
  creator: Address
  name: string
  metadataURI: string
  price: number
  priceRaw: bigint
  affiliateBps: number
  commissionPercent: number
  active: boolean
  createdAt: number
  totalSales: number
  totalVolume: number
  // Supabase enrichment
  description?: string
  category?: string
  slug?: string
  coverUrl?: string
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. Read the list of campaign addresses from the registry
  const { data: campaignAddresses, isLoading: isAddressesLoading } = useReadContract({
    address: KYNDL_REGISTRY_ADDRESS,
    abi: kyndlRegistryAbi,
    functionName: "getCampaigns",
  })

  // 2. Batch-read campaign details via the registry's `campaigns(address)` mapping
  const contracts = (campaignAddresses as Address[] | undefined)?.map((addr) => ({
    address: KYNDL_REGISTRY_ADDRESS,
    abi: kyndlRegistryAbi,
    functionName: "campaigns" as const,
    args: [addr] as const,
  })) ?? []

  const { data: campaignReads, isLoading: isDetailsLoading } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  })

  // 3. Once chain data is ready, merge with Supabase metadata
  useEffect(() => {
    if (isAddressesLoading || isDetailsLoading) return
    if (!campaignAddresses || !campaignReads) {
      setIsLoading(false)
      return
    }

    const addresses = campaignAddresses as Address[]

    const buildCampaigns = async () => {
      // Parse chain results
      const chainCampaigns: Campaign[] = []
      for (let i = 0; i < addresses.length; i++) {
        const result = campaignReads[i]
        if (result.status !== "success" || !result.result) continue

        const r = result.result as [Address, Address, string, string, bigint, number, boolean, bigint, bigint, bigint]
        const [address, creator, name, metadataURI, price, affiliateBps, active, createdAt, totalSales, totalVolume] = r

        chainCampaigns.push({
          address,
          creator,
          name,
          metadataURI,
          price: Number(formatUnits(price, 18)),
          priceRaw: price,
          affiliateBps: Number(affiliateBps),
          commissionPercent: Number(affiliateBps) / 100,
          active,
          createdAt: Number(createdAt),
          totalSales: Number(totalSales),
          totalVolume: Number(formatUnits(totalVolume, 18)),
        })
      }

      // Fetch Supabase metadata and merge
      try {
        const { data: metadata } = await supabase
          .from("campaign_metadata")
          .select("campaign_address, description, category, slug, cover_url")

        if (metadata && metadata.length > 0) {
          const metaMap = new Map(
            metadata.map((row: any) => [row.campaign_address?.toLowerCase(), row])
          )

          for (const campaign of chainCampaigns) {
            const meta = metaMap.get(campaign.address.toLowerCase())
            if (meta) {
              campaign.description = meta.description ?? undefined
              campaign.category = meta.category ?? undefined
              campaign.slug = meta.slug ?? undefined
              campaign.coverUrl = meta.cover_url ?? undefined
            }
          }
        }
      } catch {
        // Supabase fetch failed — continue with chain-only data
      }

      setCampaigns(chainCampaigns)
      setIsLoading(false)
    }

    buildCampaigns()
  }, [campaignAddresses, campaignReads, isAddressesLoading, isDetailsLoading])

  return { campaigns, isLoading }
}
