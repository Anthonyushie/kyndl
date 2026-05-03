import type { Address } from "viem"

export const MEZO_TESTNET_CHAIN_ID = 31611
export const MUSD_ADDRESS = (process.env.NEXT_PUBLIC_MUSD_ADDRESS ||
  "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503") as Address
export const KYNDL_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS || "") as Address

export const erc20Abi = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

export const kyndlRegistryAbi = [
  {
    type: "function",
    name: "createCampaign",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "affiliateBps", type: "uint16" },
    ],
    outputs: [{ name: "campaign", type: "address" }],
  },
  {
    type: "function",
    name: "campaigns",
    stateMutability: "view",
    inputs: [{ name: "campaign", type: "address" }],
    outputs: [
      { name: "campaign", type: "address" },
      { name: "creator", type: "address" },
      { name: "name", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "affiliateBps", type: "uint16" },
      { name: "active", type: "bool" },
      { name: "createdAt", type: "uint256" },
      { name: "totalSales", type: "uint256" },
      { name: "totalVolume", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getCampaigns",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    type: "function",
    name: "isAffiliateVerified",
    stateMutability: "view",
    inputs: [{ name: "affiliate", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "setAffiliateVerified",
    stateMutability: "nonpayable",
    inputs: [
      { name: "affiliate", type: "address" },
      { name: "verified", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "affiliateReputation",
    stateMutability: "view",
    inputs: [{ name: "affiliate", type: "address" }],
    outputs: [
      { name: "sales", type: "uint256" },
      { name: "volume", type: "uint256" },
      { name: "earned", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "CampaignCreated",
    inputs: [
      { indexed: true, name: "campaign", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "affiliateBps", type: "uint16" },
      { indexed: false, name: "metadataURI", type: "string" },
    ],
  },
  {
    type: "event",
    name: "ReputationUpdated",
    inputs: [
      { indexed: true, name: "buyer", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: true, name: "affiliate", type: "address" },
      { indexed: false, name: "campaign", type: "address" },
      { indexed: false, name: "totalAmount", type: "uint256" },
      { indexed: false, name: "creatorAmount", type: "uint256" },
      { indexed: false, name: "affiliateAmount", type: "uint256" },
    ],
  },
] as const

export const kyndlCampaignAbi = [
  {
    type: "function",
    name: "purchase",
    stateMutability: "nonpayable",
    inputs: [{ name: "affiliate", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "creator",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "price",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "affiliateBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint16" }],
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "metadataURI",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "event",
    name: "PurchaseSettled",
    inputs: [
      { indexed: true, name: "buyer", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: true, name: "affiliate", type: "address" },
      { indexed: false, name: "totalAmount", type: "uint256" },
      { indexed: false, name: "creatorAmount", type: "uint256" },
      { indexed: false, name: "affiliateAmount", type: "uint256" },
    ],
  },
] as const
