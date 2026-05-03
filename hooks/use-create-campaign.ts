"use client"

import { useState } from "react"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { decodeEventLog, parseUnits, type Address } from "viem"
import { KYNDL_REGISTRY_ADDRESS, kyndlRegistryAbi } from "@/lib/contracts/kyndl"
import { supabase, uploadCoverImage } from "@/lib/supabase"

export type CreateCampaignInput = {
  name: string
  price: string
  commission: number
  description: string
  category: string
  slug: string
  coverImage?: File | null
}

export function useCreateCampaign() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deploy = async (input: CreateCampaignInput): Promise<Address | null> => {
    setError(null)
    setIsDeploying(true)

    try {
      if (!publicClient) throw new Error("Wallet client is not ready.")
      if (!address) throw new Error("Wallet not connected.")
      if (!input.name.trim()) throw new Error("Campaign name is required.")
      if (!input.price || Number(input.price) <= 0) throw new Error("Price must be greater than 0.")

      // 1. Upload cover image if provided
      let coverUrl: string | null = null
      if (input.coverImage) {
        coverUrl = await uploadCoverImage(input.coverImage, address)
      }

      // 2. Insert metadata row into Supabase (campaign_address will be patched after deploy)
      const { data: metaRow, error: insertError } = await supabase
        .from("campaign_metadata")
        .insert({
          creator_address: address,
          description: input.description || null,
          category: input.category || null,
          slug: input.slug || null,
          cover_url: coverUrl,
        })
        .select("id")
        .single()

      if (insertError) {
        console.warn("Supabase insert failed (non-blocking):", insertError.message)
      }

      // 3. Call createCampaign on-chain
      const priceInMusd = parseUnits(input.price, 18)
      const affiliateBps = input.commission * 100

      const hash = await writeContractAsync({
        address: KYNDL_REGISTRY_ADDRESS,
        abi: kyndlRegistryAbi,
        functionName: "createCampaign",
        args: [input.name.trim(), input.description || "", priceInMusd, affiliateBps],
      })

      // 4. Wait for receipt + decode the CampaignCreated event
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      const createdLog = receipt.logs
        .map((log: any) => {
          try {
            return decodeEventLog({
              abi: kyndlRegistryAbi,
              data: log.data,
              topics: log.topics,
            })
          } catch {
            return null
          }
        })
        .find((log: { eventName?: string } | null) => log?.eventName === "CampaignCreated")

      const campaignAddress = createdLog?.args.campaign as Address | undefined

      // 5. Patch the Supabase row with the deployed campaign address
      if (campaignAddress && metaRow?.id) {
        const { error: updateError } = await supabase
          .from("campaign_metadata")
          .update({ campaign_address: campaignAddress })
          .eq("id", metaRow.id)

        if (updateError) {
          console.warn("Supabase update failed (non-blocking):", updateError.message)
        }
      }

      return campaignAddress ?? null
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deployment failed."
      setError(message)
      throw err
    } finally {
      setIsDeploying(false)
    }
  }

  return { deploy, isDeploying, error }
}
