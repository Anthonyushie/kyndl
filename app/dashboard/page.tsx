"use client"

import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, Link as LinkIcon, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { decodeEventLog, formatUnits, isAddress, parseUnits, type Address } from "viem"
import { KYNDL_REGISTRY_ADDRESS, kyndlRegistryAbi } from "@/lib/contracts/kyndl"

type Campaign = {
  id: string
  name: string
  priceMusd: number
  commissionPercent: number
  totalSales: number
  totalVolumeMusd: number
  topAffiliate: string
  campaignUrl: string
  createdAt: string
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    name: "Premium Content Access",
    priceMusd: 50,
    commissionPercent: 20,
    totalSales: 150,
    totalVolumeMusd: 7500,
    topAffiliate: "0x1234...5678",
    campaignUrl: "https://kyndl.io/c/camp_1",
    createdAt: "2024-05-01T10:00:00Z"
  },
  {
    id: "camp_2",
    name: "Bitcoin Mastery Course",
    priceMusd: 200,
    commissionPercent: 15,
    totalSales: 45,
    totalVolumeMusd: 9000,
    topAffiliate: "0x8765...4321",
    campaignUrl: "https://kyndl.io/c/camp_2",
    createdAt: "2024-05-15T14:30:00Z"
  }
]

type AvailableCampaign = {
  id: string
  name: string
  commissionPercent: number
  priceMusd: number
  creator: string
  totalAffiliates: number
}

const MOCK_AVAILABLE_CAMPAIGNS: AvailableCampaign[] = [
  {
    id: "camp_3",
    name: "Web3 Developer Bootcamp",
    commissionPercent: 25,
    priceMusd: 300,
    creator: "0x9999...1111",
    totalAffiliates: 42
  },
  {
    id: "camp_4",
    name: "DeFi Yield Strategies Guide",
    commissionPercent: 40,
    priceMusd: 75,
    creator: "0x7777...2222",
    totalAffiliates: 156
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { toast } = useToast()

  // Create Campaign Modal State
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState("")
  const [commission, setCommission] = useState([20])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chainCampaigns, setChainCampaigns] = useState<Campaign[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const isRegistryConfigured = isAddress(KYNDL_REGISTRY_ADDRESS)

  // Passport gate — redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  const handleDeployCampaign = async () => {
    if (!isRegistryConfigured) {
      toast({
        title: "Registry not configured",
        description: "Set NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS after deploying KyndlRegistry.",
        variant: "destructive",
      })
      return
    }

    if (!publicClient || !productName.trim() || !price || Number(price) <= 0) {
      toast({
        title: "Missing campaign details",
        description: "Enter a product name and MUSD price before deploying.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeploying(true)
      const priceInMusd = parseUnits(price, 18)
      const affiliateBps = commission[0] * 100
      const hash = await writeContractAsync({
        address: KYNDL_REGISTRY_ADDRESS,
        abi: kyndlRegistryAbi,
        functionName: "createCampaign",
        args: [productName.trim(), "", priceInMusd, affiliateBps],
      })

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
      if (campaignAddress) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://kyndl.xyz"
        setChainCampaigns((prev) => [
          {
            id: campaignAddress,
            name: productName.trim(),
            priceMusd: Number(formatUnits(priceInMusd, 18)),
            commissionPercent: commission[0],
            totalSales: 0,
            totalVolumeMusd: 0,
            topAffiliate: "None yet",
            campaignUrl: `${origin}/buy/${campaignAddress}`,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ])
      }

      toast({
        title: "Campaign deployed",
        description: campaignAddress ? `${campaignAddress.slice(0, 6)}...${campaignAddress.slice(-4)}` : "Transaction confirmed.",
      })
      setIsModalOpen(false)
      setProductName("")
      setPrice("")
      setCommission([20])
    } catch (error) {
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "The transaction did not complete.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleCopyLink = (campaignId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://kyndl.xyz"
    const link = `${origin}/buy/${campaignId}?ref=${address || "0x0"}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied!",
      description: "Affiliate link copied to clipboard.",
    })
  }

  // Summary Metrics
  const creatorCampaigns = [...chainCampaigns, ...MOCK_CAMPAIGNS]
  const totalSalesVolume = creatorCampaigns.reduce((acc, camp) => acc + camp.totalVolumeMusd, 0)
  const totalEarned = creatorCampaigns.reduce((acc, camp) => acc + (camp.totalVolumeMusd * (1 - camp.commissionPercent / 100)), 0)
  const totalAffiliates = 12 // Mock

  // Affiliate Metrics
  const affiliateVolume = 1250 // Mock $1250
  const affiliateTier = affiliateVolume >= 2000 ? "Gold" : affiliateVolume >= 500 ? "Silver" : "Bronze"
  const nextTierThreshold = affiliateTier === "Bronze" ? 500 : affiliateTier === "Silver" ? 2000 : null
  const progressPercent = nextTierThreshold ? (affiliateVolume / nextTierThreshold) * 100 : 100

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={120} height={28} className="h-7 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <Tabs defaultValue="creator" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="creator" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-md">Creator</TabsTrigger>
              <TabsTrigger value="affiliate" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-md">Affiliate</TabsTrigger>
            </TabsList>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="primary" className="shadow-lg shadow-[#ff364d]/20">Create Campaign</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create Campaign</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Deploy a new product link. Affiliates get paid instantly on chain when a sale occurs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white/80 text-xs uppercase tracking-wider">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. My Awesome Course"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-black border-white/20 text-white focus-visible:ring-[#ff364d]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price" className="text-white/80 text-xs uppercase tracking-wider">Price (MUSD)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g. 100"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-black border-white/20 text-white focus-visible:ring-[#ff364d]"
                    />
                  </div>
                  <div className="grid gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80 text-xs uppercase tracking-wider">Commission %</Label>
                      <span className="text-[#ff364d] font-bold">{commission[0]}%</span>
                    </div>
                    <Slider
                      defaultValue={[20]}
                      max={50}
                      min={1}
                      step={1}
                      value={commission}
                      onValueChange={setCommission}
                      className="[&_[role=slider]]:bg-[#ff364d] [&_[role=slider]]:border-[#ff364d] [&_[data-orientation=horizontal]>div]:bg-[#ff364d]/20 [&_[data-orientation=horizontal]>div>div]:bg-[#ff364d]"
                    />
                    <p className="text-xs text-white/40 text-right">You receive {100 - commission[0]}% per sale.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="primary" onClick={handleDeployCampaign} className="w-full" disabled={isDeploying}>
                    {isDeploying ? "Deploying..." : "Deploy Campaign"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="creator" className="mt-0 outline-none">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Total MUSD Earned</p>
                <p className="text-3xl font-bold text-white">${totalEarned.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-2">Volume: ${totalSalesVolume.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Active Campaigns</p>
                <p className="text-3xl font-bold text-white">{creatorCampaigns.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Total Affiliates</p>
                <p className="text-3xl font-bold text-white">{totalAffiliates}</p>
              </div>
            </div>

            {/* Campaigns List */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Your Campaigns</h2>
              <div className="grid gap-4">
                {creatorCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors gap-6">
                    
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
                        <span className="font-mono text-[#ff364d]">{campaign.priceMusd} MUSD</span>
                        <span>•</span>
                        <span>{campaign.commissionPercent}% Commission</span>
                        <span>•</span>
                        <span>Top Affiliate: <span className="font-mono text-white/80">{campaign.topAffiliate}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-white/60 mb-1">Sales</p>
                        <p className="font-bold text-white">{campaign.totalSales}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 mb-1">Volume</p>
                        <p className="font-bold text-green-400">${campaign.totalVolumeMusd.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full md:w-auto flex items-center gap-2 border-white/20 hover:bg-white/10 hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(campaign.campaignUrl)
                          alert("Campaign URL copied to clipboard!")
                        }}
                      >
                        <Copy size={16} />
                        Copy URL
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="affiliate" className="mt-0 outline-none">
            {/* Reputation Badge */}
            <div className="mb-8 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${
                  affiliateTier === 'Gold' ? 'bg-yellow-500/20 text-yellow-500' : 
                  affiliateTier === 'Silver' ? 'bg-gray-300/20 text-gray-300' : 
                  'bg-[#cd7f32]/20 text-[#cd7f32]'
                }`}>
                  <Trophy size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{affiliateTier} Tier</h3>
                  <p className="text-sm text-white/60">Cumulative Sales: ${affiliateVolume.toLocaleString()}</p>
                </div>
              </div>
              
              {nextTierThreshold && (
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/60">Next Tier</span>
                    <span className="text-white">${nextTierThreshold.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-[#ff364d] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Browser */}
            <h2 className="text-xl font-bold text-white mb-6">Available Campaigns</h2>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              {MOCK_AVAILABLE_CAMPAIGNS.map((campaign) => (
                <div key={campaign.id} className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{campaign.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-white/40 mb-1">Commission</p>
                        <p className="font-bold text-[#ff364d]">{campaign.commissionPercent}%</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Price</p>
                        <p className="font-mono text-white">{campaign.priceMusd} MUSD</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Creator</p>
                        <p className="font-mono text-white/80">{campaign.creator}</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Affiliates</p>
                        <p className="text-white">{campaign.totalAffiliates}</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleCopyLink(campaign.id)}
                  >
                    <LinkIcon size={16} />
                    Get My Link
                  </Button>
                </div>
              ))}
            </div>

            {/* Affiliate Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Total Earned</p>
                <p className="text-3xl font-bold text-white">$450.00</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-yellow-500">$25.50</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">Lifetime Sales Driven</p>
                <p className="text-3xl font-bold text-white">32</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
