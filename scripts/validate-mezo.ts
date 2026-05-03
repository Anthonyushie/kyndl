import "dotenv/config"
import { network } from "hardhat"

const OFFICIAL_MEZO_MUSD = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503"

const { ethers } = await network.create()
const [deployer] = await ethers.getSigners()

const configuredMusd = process.env.MEZO_TESTNET_MUSD_ADDRESS ?? process.env.NEXT_PUBLIC_MUSD_ADDRESS
const registryAddress = process.env.NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS
const affiliateAddress = process.env.MEZO_TEST_AFFILIATE_ADDRESS
const purchaseAmount = ethers.parseUnits(process.env.MEZO_TEST_PURCHASE_MUSD ?? "0.01", 18)
const affiliateBps = 2_000

if (configuredMusd?.toLowerCase() !== OFFICIAL_MEZO_MUSD.toLowerCase()) {
  throw new Error(`MUSD must be the official Mezo testnet MUSD address: ${OFFICIAL_MEZO_MUSD}`)
}

if (!registryAddress) {
  throw new Error("Set NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS to your deployed KyndlRegistry address.")
}

if (!affiliateAddress) {
  throw new Error("Set MEZO_TEST_AFFILIATE_ADDRESS to a second testnet wallet address for referral validation.")
}

if (affiliateAddress.toLowerCase() === deployer.address.toLowerCase()) {
  throw new Error("MEZO_TEST_AFFILIATE_ADDRESS must be different from the deployer/buyer wallet.")
}

const providerNetwork = await ethers.provider.getNetwork()
if (providerNetwork.chainId !== 31611n) {
  throw new Error(`Expected Mezo testnet chainId 31611, got ${providerNetwork.chainId.toString()}.`)
}

const musd = await ethers.getContractAt("IERC20", OFFICIAL_MEZO_MUSD)
const registry = await ethers.getContractAt("KyndlRegistry", registryAddress)

const registryPaymentToken = await registry.paymentToken()
if (registryPaymentToken.toLowerCase() !== OFFICIAL_MEZO_MUSD.toLowerCase()) {
  throw new Error(`Registry paymentToken is ${registryPaymentToken}, expected ${OFFICIAL_MEZO_MUSD}.`)
}

const deployerGasBalance = await ethers.provider.getBalance(deployer.address)
const deployerMusdBalance = await musd.balanceOf(deployer.address)

console.log("Mezo validation")
console.log("Chain ID:", providerNetwork.chainId.toString())
console.log("Deployer/buyer:", deployer.address)
console.log("Registry:", registryAddress)
console.log("Official MUSD:", OFFICIAL_MEZO_MUSD)
console.log("Affiliate:", affiliateAddress)
console.log("Gas balance:", ethers.formatEther(deployerGasBalance), "BTC")
console.log("MUSD balance:", ethers.formatUnits(deployerMusdBalance, 18), "MUSD")

if (deployerMusdBalance < purchaseAmount * 2n) {
  throw new Error(
    `Deployer needs at least ${ethers.formatUnits(purchaseAmount * 2n, 18)} MUSD for this validation.`,
  )
}

console.log("Creating no-ref campaign...")
const noRefCampaignAddress = await registry
  .createCampaign.staticCall("Kyndl Mezo No Ref Validation", "", purchaseAmount, affiliateBps)
await (await registry.createCampaign("Kyndl Mezo No Ref Validation", "", purchaseAmount, affiliateBps)).wait()
const noRefCampaign = await ethers.getContractAt("KyndlCampaign", noRefCampaignAddress)

if ((await noRefCampaign.paymentToken()).toLowerCase() !== OFFICIAL_MEZO_MUSD.toLowerCase()) {
  throw new Error("No-ref campaign is not using official Mezo MUSD.")
}

console.log("Buying no-ref campaign...")
await (await musd.approve(noRefCampaignAddress, purchaseAmount)).wait()
await (await noRefCampaign.purchase(ethers.ZeroAddress)).wait()

console.log("Verifying affiliate...")
await (await registry.setAffiliateVerified(affiliateAddress, true)).wait()

console.log("Creating referred campaign...")
const refCampaignAddress = await registry
  .createCampaign.staticCall("Kyndl Mezo Ref Validation", "", purchaseAmount, affiliateBps)
await (await registry.createCampaign("Kyndl Mezo Ref Validation", "", purchaseAmount, affiliateBps)).wait()
const refCampaign = await ethers.getContractAt("KyndlCampaign", refCampaignAddress)

if ((await refCampaign.paymentToken()).toLowerCase() !== OFFICIAL_MEZO_MUSD.toLowerCase()) {
  throw new Error("Referred campaign is not using official Mezo MUSD.")
}

const affiliateBefore = await musd.balanceOf(affiliateAddress)
console.log("Buying referred campaign...")
await (await musd.approve(refCampaignAddress, purchaseAmount)).wait()
await (await refCampaign.purchase(affiliateAddress)).wait()
const affiliateAfter = await musd.balanceOf(affiliateAddress)

const expectedAffiliateAmount = (purchaseAmount * BigInt(affiliateBps)) / 10_000n
if (affiliateAfter - affiliateBefore !== expectedAffiliateAmount) {
  throw new Error("Affiliate payout did not match expected split.")
}

const affiliateStats = await registry.affiliateReputation(affiliateAddress)
if (affiliateStats.sales < 1n || affiliateStats.earned < expectedAffiliateAmount) {
  throw new Error("Affiliate reputation was not updated.")
}

console.log("Validation complete.")
console.log("No-ref campaign:", noRefCampaignAddress)
console.log("Referred campaign:", refCampaignAddress)
console.log("Affiliate payout:", ethers.formatUnits(expectedAffiliateAmount, 18), "MUSD")
