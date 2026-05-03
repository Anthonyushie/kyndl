"use client"

import { useAccount, usePublicClient, useReadContracts, useWriteContract } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react"
import { formatUnits, isAddress, parseUnits, zeroAddress, type Address, type Hash } from "viem"
import { erc20Abi, kyndlCampaignAbi, MUSD_ADDRESS } from "@/lib/contracts/kyndl"
import { useToast } from "@/hooks/use-toast"

// Mock database for campaign lookup
const MOCK_CAMPAIGN_DB: Record<string, { name: string; priceMusd: number; commissionPercent: number; description: string }> = {
  "camp_1": {
    name: "Premium Content Access",
    priceMusd: 50,
    commissionPercent: 20,
    description: "Get lifetime access to exclusive premium content, tutorials, and private community channels."
  },
  "camp_2": {
    name: "Bitcoin Mastery Course",
    priceMusd: 200,
    commissionPercent: 15,
    description: "A comprehensive deep dive into Bitcoin, Lightning Network, and building decentralized applications."
  },
  "camp_3": {
    name: "Web3 Developer Bootcamp",
    priceMusd: 300,
    commissionPercent: 25,
    description: "From zero to hero in Web3 development. Learn Solidity, React, and smart contract security."
  },
  "camp_4": {
    name: "DeFi Yield Strategies Guide",
    priceMusd: 75,
    commissionPercent: 40,
    description: "Advanced yield farming strategies across multiple chains. Maximize your returns safely."
  }
}

function BuyPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const { toast } = useToast()
  
  const campaignId = params.campaignId as string
  const urlRefParam = searchParams.get("ref")
  const isChainCampaign = isAddress(campaignId)
  const campaignAddress = isChainCampaign ? (campaignId as Address) : undefined

  const [affiliateAddress, setAffiliateAddress] = useState<string | null>(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseHash, setPurchaseHash] = useState<Hash | null>(null)

  const { data: campaignReads, isLoading: isCampaignLoading } = useReadContracts({
    contracts: campaignAddress
      ? [
          { address: campaignAddress, abi: kyndlCampaignAbi, functionName: "name" },
          { address: campaignAddress, abi: kyndlCampaignAbi, functionName: "price" },
          { address: campaignAddress, abi: kyndlCampaignAbi, functionName: "affiliateBps" },
          { address: campaignAddress, abi: kyndlCampaignAbi, functionName: "metadataURI" },
        ]
      : [],
    query: { enabled: Boolean(campaignAddress) },
  })

  const chainCampaign =
    isChainCampaign && campaignReads?.every((result: { status: string }) => result.status === "success")
      ? {
          name: campaignReads[0].result as string,
          priceMusd: Number(formatUnits(campaignReads[1].result as bigint, 18)),
          priceRaw: campaignReads[1].result as bigint,
          commissionPercent: Number(campaignReads[2].result as bigint | number) / 100,
          description:
            ((campaignReads[3].result as string) || "This campaign settles creator and affiliate payouts instantly on Mezo Testnet."),
        }
      : null

  const mockCampaign = MOCK_CAMPAIGN_DB[campaignId]
  const campaign = chainCampaign ?? mockCampaign
  const priceRaw = chainCampaign?.priceRaw ?? (mockCampaign ? parseUnits(String(mockCampaign.priceMusd), 18) : BigInt(0))

  // Handle Affiliate Ref persistence
  useEffect(() => {
    if (!campaignId) return

    const storageKey = `kyndl_ref_${campaignId}`
    
    // If there is a ref in the URL, save it and use it
    if (urlRefParam) {
      sessionStorage.setItem(storageKey, urlRefParam)
      setAffiliateAddress(urlRefParam)
    } else {
      // If no ref in URL, try to recover from session storage
      const cachedRef = sessionStorage.getItem(storageKey)
      if (cachedRef) {
        setAffiliateAddress(cachedRef)
      }
    }
  }, [campaignId, urlRefParam])

  if (isCampaignLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#ff364d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Campaign Not Found</h1>
        <p className="text-white/60 mb-6">The product you are looking for does not exist.</p>
        <Link href="/">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Return Home</Button>
        </Link>
      </div>
    )
  }

  const handleBuy = async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }

    setIsProcessing(true)

    try {
      if (campaignAddress && chainCampaign) {
        if (!publicClient) throw new Error("Wallet client is not ready yet.")
        if (affiliateAddress && !isAddress(affiliateAddress)) {
          throw new Error("The referral address in the URL is not a valid wallet address.")
        }

        const affiliate = affiliateAddress && isAddress(affiliateAddress) ? (affiliateAddress as Address) : zeroAddress
        const approvalHash = await writeContractAsync({
          address: MUSD_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [campaignAddress, priceRaw],
        })
        await publicClient.waitForTransactionReceipt({ hash: approvalHash })

        const txHash = await writeContractAsync({
          address: campaignAddress,
          abi: kyndlCampaignAbi,
          functionName: "purchase",
          args: [affiliate],
        })
        await publicClient.waitForTransactionReceipt({ hash: txHash })
        setPurchaseHash(txHash)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log("Mock Contract Call -> Executing Purchase:", {
          campaignId,
          buyer: address,
          affiliate: affiliateAddress || "No Affiliate",
          priceMusd: campaign.priceMusd
        })
      }

      setIsPurchased(true)
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "The transaction did not complete.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPurchased) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Complete!</h1>
          <p className="text-white/60 mb-8">
            You successfully purchased <span className="text-white font-medium">{campaign.name}</span> for {campaign.priceMusd} MUSD.
          </p>
          {purchaseHash && (
            <a
              href={`https://explorer.test.mezo.org/tx/${purchaseHash}`}
              target="_blank"
              rel="noreferrer"
              className="mb-6 block truncate font-mono text-xs text-[#ff364d] hover:text-[#ff6b7b]"
            >
              {purchaseHash}
            </a>
          )}
          <Link href="/">
            <Button variant="primary" className="w-full shadow-lg shadow-[#ff364d]/20">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-[#ff364d]/30">
      {/* Simple Header */}
      <div className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={100} height={24} className="h-6 w-auto" />
          </Link>
          <div className="text-xs font-mono text-white/40 border border-white/10 rounded-full px-3 py-1 bg-white/5 flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#ff364d]" />
            Mezo Testnet
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Product Details Left Side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff364d]/10 border border-[#ff364d]/20 text-[#ff364d] text-xs font-semibold uppercase tracking-wider">
              Kyndl Secure Checkout
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {campaign.name}
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              {campaign.description}
            </p>
            
            {affiliateAddress && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mt-8">
                <HeartHandshake className="text-blue-400 mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-sm text-blue-400 font-medium mb-1">You were referred!</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    By purchasing through this link, <span className="text-white font-mono">{campaign.commissionPercent}%</span> of this sale goes directly to the person who shared this with you (<span className="font-mono text-white/80">{affiliateAddress.slice(0, 6)}...{affiliateAddress.slice(-4)}</span>).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Card Right Side */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff364d] opacity-5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-2">Order Summary</h2>
              
              <div className="flex items-end gap-2 mb-8">
                <span className="text-5xl font-bold text-white tracking-tighter">{campaign.priceMusd}</span>
                <span className="text-xl text-white/60 font-medium mb-1">MUSD</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Product</span>
                  <span className="text-white font-medium truncate ml-4">{campaign.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Network</span>
                  <span className="text-white font-medium">Mezo Testnet</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full text-lg h-14 shadow-lg shadow-[#ff364d]/20 flex items-center justify-center gap-2 group"
                onClick={handleBuy}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : !isConnected ? (
                  "Connect Wallet to Buy"
                ) : (
                  <>
                    Buy Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1">
                Powered by <span className="font-semibold text-white/80">Kyndl Protocol</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <BuyPageContent />
    </Suspense>
  )
}
