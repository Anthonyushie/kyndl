import { expect } from "chai"
import { network } from "hardhat"

const { ethers } = await network.create()

describe("KyndlCampaign", function () {
  const price = ethers.parseUnits("100", 18)
  const affiliateBps = 2_000

  async function deployFixture() {
    const [owner, creator, buyer, affiliate, unverified, other] = await ethers.getSigners()

    const musd = await ethers.deployContract("MockMUSD")
    const registry = await ethers.deployContract("KyndlRegistry", [await musd.getAddress(), owner.address])

    const campaignAddress = await registry
      .connect(creator)
      .createCampaign.staticCall("Bitcoin Mastery", "ipfs://course", price, affiliateBps)

    await expect(registry.connect(creator).createCampaign("Bitcoin Mastery", "ipfs://course", price, affiliateBps))
      .to.emit(registry, "CampaignCreated")
      .withArgs(campaignAddress, creator.address, "Bitcoin Mastery", price, affiliateBps, "ipfs://course")

    const campaign = await ethers.getContractAt("KyndlCampaign", campaignAddress)
    await registry.connect(owner).setAffiliateVerified(affiliate.address, true)

    return { owner, creator, buyer, affiliate, unverified, other, musd, registry, campaign }
  }

  it("stores split math correctly", async function () {
    const { campaign } = await deployFixture()

    expect(await campaign.price()).to.equal(price)
    expect(await campaign.affiliateBps()).to.equal(affiliateBps)
    expect((price * BigInt(affiliateBps)) / 10_000n).to.equal(ethers.parseUnits("20", 18))
  })

  it("settles a no-ref purchase fully to the creator", async function () {
    const { buyer, creator, musd, registry, campaign } = await deployFixture()

    await musd.mint(buyer.address, price)
    await musd.connect(buyer).approve(await campaign.getAddress(), price)

    await expect(campaign.connect(buyer).purchase(ethers.ZeroAddress))
      .to.emit(campaign, "PurchaseSettled")
      .withArgs(buyer.address, creator.address, ethers.ZeroAddress, price, price, 0)

    expect(await musd.balanceOf(creator.address)).to.equal(price)
    expect(await campaign.totalSales()).to.equal(1)

    const creatorStats = await registry.creatorReputation(creator.address)
    expect(creatorStats.sales).to.equal(1)
    expect(creatorStats.volume).to.equal(price)
    expect(creatorStats.earned).to.equal(price)
  })

  it("settles a referred purchase to creator and affiliate", async function () {
    const { buyer, creator, affiliate, musd, registry, campaign } = await deployFixture()
    const affiliateAmount = ethers.parseUnits("20", 18)
    const creatorAmount = ethers.parseUnits("80", 18)

    await musd.mint(buyer.address, price)
    await musd.connect(buyer).approve(await campaign.getAddress(), price)

    await expect(campaign.connect(buyer).purchase(affiliate.address))
      .to.emit(campaign, "PurchaseSettled")
      .withArgs(buyer.address, creator.address, affiliate.address, price, creatorAmount, affiliateAmount)

    expect(await musd.balanceOf(creator.address)).to.equal(creatorAmount)
    expect(await musd.balanceOf(affiliate.address)).to.equal(affiliateAmount)

    const affiliateStats = await registry.affiliateReputation(affiliate.address)
    expect(affiliateStats.sales).to.equal(1)
    expect(affiliateStats.volume).to.equal(price)
    expect(affiliateStats.earned).to.equal(affiliateAmount)
  })

  it("rejects creator, buyer, and unverified affiliates", async function () {
    const { buyer, creator, unverified, musd, campaign } = await deployFixture()

    await musd.mint(buyer.address, price * 3n)
    await musd.connect(buyer).approve(await campaign.getAddress(), price * 3n)

    await expect(campaign.connect(buyer).purchase(creator.address)).to.be.revertedWithCustomError(
      campaign,
      "InvalidAffiliate",
    )
    await expect(campaign.connect(buyer).purchase(buyer.address)).to.be.revertedWithCustomError(
      campaign,
      "InvalidAffiliate",
    )
    await expect(campaign.connect(buyer).purchase(unverified.address)).to.be.revertedWithCustomError(
      campaign,
      "UnverifiedAffiliate",
    )
  })

  it("reverts when allowance is insufficient", async function () {
    const { buyer, affiliate, musd, campaign } = await deployFixture()

    await musd.mint(buyer.address, price)

    await expect(campaign.connect(buyer).purchase(affiliate.address)).to.be.revertedWithCustomError(
      musd,
      "ERC20InsufficientAllowance",
    )
  })

  it("reverts when balance is insufficient", async function () {
    const { buyer, affiliate, musd, campaign } = await deployFixture()

    await musd.connect(buyer).approve(await campaign.getAddress(), price)

    await expect(campaign.connect(buyer).purchase(affiliate.address)).to.be.revertedWithCustomError(
      musd,
      "ERC20InsufficientBalance",
    )
  })

  it("blocks reentrant purchase attempts from a malicious token", async function () {
    const [owner, creator, buyer] = await ethers.getSigners()
    const reentrantMusd = await ethers.deployContract("ReentrantMUSD")
    const registry = await ethers.deployContract("KyndlRegistry", [await reentrantMusd.getAddress(), owner.address])

    const campaignAddress = await registry
      .connect(creator)
      .createCampaign.staticCall("Reentrant Test", "ipfs://reentrant", price, affiliateBps)
    await registry.connect(creator).createCampaign("Reentrant Test", "ipfs://reentrant", price, affiliateBps)
    const campaign = await ethers.getContractAt("KyndlCampaign", campaignAddress)

    await reentrantMusd.mint(buyer.address, price)
    await reentrantMusd.connect(buyer).approve(campaignAddress, price)
    await reentrantMusd.setAttack(campaignAddress, true)

    await expect(campaign.connect(buyer).purchase(ethers.ZeroAddress)).to.be.revertedWithCustomError(
      campaign,
      "ReentrancyGuardReentrantCall",
    )
  })
})
