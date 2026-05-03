# Kyndl Smart Contract Documentation

This document explains the smart-contract work for Kyndl: what was deployed, why the contracts exist, how purchases are settled, how affiliates are verified, and how the frontend/backend should integrate with the deployed contracts.

## Current Deployment

Network:

- Network name: `Mezo Testnet`
- Chain ID: `31611`
- RPC URL: `https://rpc.test.mezo.org`
- Explorer: `https://explorer.test.mezo.org`

Token:

- MUSD testnet token: `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503`
- Source: Mezo official contracts reference, `MUSD token and bridge` section.

Kyndl deployment:

- `KyndlRegistry`: `0x331721D9Cf63c40A7d429c15A4018066584E8e38`
- Deployer/registry owner: `0x3795D8e2a0AA19FA332506a9d3b09519F01C7D4F`
- Deployment record: `deployments/mezo-testnet.json`

The frontend must know the registry address. Add this to `.env`:

```env
NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS=0x331721D9Cf63c40A7d429c15A4018066584E8e38
```

Restart the frontend after changing `.env`.

## What Was Built

There are two production contracts:

- `KyndlRegistry.sol`
- `KyndlCampaign.sol`

There are no mock token contracts in the implementation. The contracts are configured around Mezo's official testnet MUSD contract at `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503`.

The product flow is:

1. A creator creates a campaign through `KyndlRegistry`.
2. The registry deploys a new `KyndlCampaign` contract.
3. Affiliates share links pointing to the campaign address.
4. A buyer approves MUSD spending for the campaign contract.
5. The buyer calls `purchase(affiliate)`.
6. The campaign transfers MUSD from buyer and splits it to creator and affiliate in the same transaction.
7. The registry records creator and affiliate reputation stats.

## Contract Architecture

```text
Buyer wallet
  |
  | approve MUSD to campaign
  v
MUSD token
  |
  | purchase(ref)
  v
KyndlCampaign
  |-- sends creator payout
  |-- sends affiliate payout, if valid ref
  |
  v
KyndlRegistry
  |-- records campaign totals
  |-- records creator reputation
  |-- records affiliate reputation
```

`KyndlRegistry` is the factory and source of truth for created campaigns. `KyndlCampaign` is the actual checkout contract for one product/campaign.

## KyndlRegistry

Source file:

```text
contracts/KyndlRegistry.sol
```

Responsibilities:

- Stores the MUSD token address used by all campaigns.
- Deploys new campaign contracts.
- Tracks every deployed campaign address.
- Stores campaign metadata and totals.
- Stores verified affiliate status.
- Stores creator and affiliate reputation totals.
- Allows only legitimate campaign contracts to record purchases.

Constructor:

```solidity
constructor(address paymentToken_, address owner_)
```

Parameters:

- `paymentToken_`: MUSD token address.
- `owner_`: registry admin address. This account can verify/unverify affiliates.

### createCampaign

```solidity
function createCampaign(
    string calldata name,
    string calldata metadataURI,
    uint256 price,
    uint16 affiliateBps
) external returns (address campaign);
```

Creates and deploys a new `KyndlCampaign`.

Parameters:

- `name`: product or campaign name.
- `metadataURI`: optional offchain metadata URI. Empty string is allowed.
- `price`: MUSD price in token base units. MUSD uses 18 decimals, so `100 MUSD` is `100000000000000000000`.
- `affiliateBps`: affiliate commission in basis points.

Basis points:

```text
10000 bps = 100%
2000 bps = 20%
500 bps = 5%
```

Returns:

- The newly deployed `KyndlCampaign` address.

Emits:

```solidity
event CampaignCreated(
    address indexed campaign,
    address indexed creator,
    string name,
    uint256 price,
    uint16 affiliateBps,
    string metadataURI
);
```

Frontend usage:

- The dashboard calls this when a creator clicks `Deploy Campaign`.
- The returned campaign address becomes the checkout URL:

```text
/buy/0xCampaignAddress
```

Affiliate URL:

```text
/buy/0xCampaignAddress?ref=0xAffiliateAddress
```

### setAffiliateVerified

```solidity
function setAffiliateVerified(address affiliate, bool verified) external onlyOwner;
```

Marks an affiliate as verified or unverified.

Only the registry owner can call this.

Important behavior:

- If a buyer uses a non-zero affiliate address, that affiliate must be verified.
- If the affiliate is not verified, `purchase()` reverts.
- `address(0)` is used for no-ref purchases and does not need verification.

Emits:

```solidity
event AffiliateVerificationChanged(address indexed affiliate, bool verified);
```

### isAffiliateVerified

```solidity
function isAffiliateVerified(address affiliate) external view returns (bool);
```

Returns whether an affiliate is verified.

`KyndlCampaign.purchase()` calls this before paying affiliate commission.

### recordPurchase

```solidity
function recordPurchase(
    address buyer,
    address creator,
    address affiliate,
    address campaign,
    uint256 totalAmount,
    uint256 creatorAmount,
    uint256 affiliateAmount
) external;
```

Called by a valid `KyndlCampaign` after a purchase settles.

Security rule:

- Only a deployed Kyndl campaign can call this.
- The caller must equal the `campaign` argument.

Updates:

- Campaign total sales.
- Campaign total volume.
- Creator reputation.
- Affiliate reputation, if affiliate is non-zero.

Emits:

```solidity
event ReputationUpdated(
    address indexed buyer,
    address indexed creator,
    address indexed affiliate,
    address campaign,
    uint256 totalAmount,
    uint256 creatorAmount,
    uint256 affiliateAmount
);
```

### Read Functions

```solidity
function getCampaigns() external view returns (address[] memory);
function campaignCount() external view returns (uint256);
function campaigns(address campaign) external view returns (CampaignInfo memory);
function creatorReputation(address creator) external view returns (Reputation memory);
function affiliateReputation(address affiliate) external view returns (Reputation memory);
```

These are intended for frontend/backend reads.

`CampaignInfo` contains:

```solidity
struct CampaignInfo {
    address campaign;
    address creator;
    string name;
    string metadataURI;
    uint256 price;
    uint16 affiliateBps;
    bool active;
    uint256 createdAt;
    uint256 totalSales;
    uint256 totalVolume;
}
```

`Reputation` contains:

```solidity
struct Reputation {
    uint256 sales;
    uint256 volume;
    uint256 earned;
}
```

## KyndlCampaign

Source file:

```text
contracts/KyndlCampaign.sol
```

Responsibilities:

- Represents one product/campaign checkout.
- Stores immutable campaign terms.
- Receives buyer purchase calls.
- Pulls MUSD from buyer.
- Splits MUSD between creator and affiliate.
- Records the purchase in the registry.
- Blocks reentrancy.

Constructor:

```solidity
constructor(
    address paymentToken_,
    address registry_,
    address creator_,
    uint256 price_,
    uint16 affiliateBps_,
    string memory name_,
    string memory metadataURI_
)
```

This constructor is called by `KyndlRegistry.createCampaign`. The frontend should not deploy `KyndlCampaign` directly.

### purchase

```solidity
function purchase(address affiliate) external;
```

Main checkout function.

Buyer flow:

1. Buyer approves the campaign contract to spend `price` MUSD.
2. Buyer calls `purchase(affiliate)`.
3. Contract pulls `price` MUSD from buyer.
4. Contract sends payout to creator and affiliate.
5. Contract records the purchase in the registry.

No-ref purchase:

```solidity
purchase(address(0));
```

Result:

- Creator receives 100%.
- Affiliate receives 0.

Referred purchase:

```solidity
purchase(affiliateAddress);
```

Rules:

- Affiliate cannot be `address(0)` if a ref is intended.
- Affiliate cannot be the creator.
- Affiliate cannot be the buyer.
- Affiliate must be verified in `KyndlRegistry`.

Split math:

```solidity
affiliateAmount = price * affiliateBps / 10_000;
creatorAmount = price - affiliateAmount;
```

Example:

```text
Price: 100 MUSD
Affiliate commission: 20% = 2000 bps
Affiliate receives: 20 MUSD
Creator receives: 80 MUSD
```

Emits:

```solidity
event PurchaseSettled(
    address indexed buyer,
    address indexed creator,
    address indexed affiliate,
    uint256 totalAmount,
    uint256 creatorAmount,
    uint256 affiliateAmount
);
```

### setActive

```solidity
function setActive(bool active_) external;
```

Allows the creator to pause or reactivate the campaign.

Only the campaign creator can call this.

Emits:

```solidity
event CampaignStatusChanged(bool active);
```

## Frontend Integration

Contract helper file:

```text
lib/contracts/kyndl.ts
```

This file exports:

- Mezo testnet chain ID.
- MUSD address.
- Registry address from `.env`.
- ERC20 ABI.
- Registry ABI.
- Campaign ABI.

Environment variables required by the frontend:

```env
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_MUSD_ADDRESS=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS=0x331721D9Cf63c40A7d429c15A4018066584E8e38
```

Dashboard integration:

```text
app/dashboard/page.tsx
```

The dashboard:

- Lets creators enter campaign name, price, and commission.
- Converts MUSD price to 18-decimal units.
- Converts commission percentage to basis points.
- Calls `KyndlRegistry.createCampaign`.
- Reads the `CampaignCreated` event.
- Builds the checkout URL from the emitted campaign address.

Buy page integration:

```text
app/buy/[campaignId]/page.tsx
```

The buy page:

- Treats `[campaignId]` as the campaign contract address when it is a valid address.
- Reads campaign name, price, affiliate bps, and metadata from `KyndlCampaign`.
- Stores `?ref=0xAffiliateAddress` in session storage.
- Calls MUSD `approve(campaignAddress, price)`.
- Calls `KyndlCampaign.purchase(ref)`.
- Shows the Mezo explorer transaction hash after success.

## Backend Integration Notes

The backend can use the same event specs to index activity.

Recommended events to listen for:

- `KyndlRegistry.CampaignCreated`
- `KyndlRegistry.AffiliateVerificationChanged`
- `KyndlCampaign.PurchaseSettled`
- `KyndlRegistry.ReputationUpdated`

Recommended backend tables:

- `campaigns`
- `purchases`
- `affiliates`
- `creator_reputation`
- `affiliate_reputation`

Recommended indexing flow:

1. Listen for `CampaignCreated`.
2. Store campaign address, creator, name, price, affiliate bps, metadata URI.
3. Listen for `PurchaseSettled` on each campaign.
4. Store buyer, creator, affiliate, amount, payout split, tx hash, block number.
5. Listen for `ReputationUpdated` or read reputation from registry.

## Deployment

Deployment script:

```text
scripts/deploy-mezo.ts
```

Hardhat config:

```text
hardhat.config.ts
```

Deployment environment variables:

```env
MEZO_TESTNET_RPC_URL=https://rpc.test.mezo.org
MEZO_TESTNET_PRIVATE_KEY=0xYourPrivateKey
MEZO_TESTNET_MUSD_ADDRESS=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
```

Deploy command:

```bash
npm run contracts:deploy:mezo
```

The script deploys `KyndlRegistry` only. Individual `KyndlCampaign` contracts are deployed later through the registry when creators create campaigns.

Deployment output is saved here:

```text
deployments/mezo-testnet.json
```

Current output:

```json
{
  "network": "mezoTestnet",
  "chainId": 31611,
  "paymentToken": "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
  "registry": "0x331721D9Cf63c40A7d429c15A4018066584E8e38",
  "deployer": "0x3795D8e2a0AA19FA332506a9d3b09519F01C7D4F"
}
```

## Mezo Testnet Validation

Validation script:

```text
scripts/validate-mezo.ts
```

Run:

```bash
npm run contracts:validate:mezo
```

This script uses only Mezo testnet and the official Mezo MUSD contract. It does not deploy or use any mock token.

Required `.env` values:

```env
MEZO_TESTNET_RPC_URL=https://rpc.test.mezo.org
MEZO_TESTNET_PRIVATE_KEY=0xYourBuyerAndRegistryOwnerPrivateKey
MEZO_TESTNET_MUSD_ADDRESS=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS=0x331721D9Cf63c40A7d429c15A4018066584E8e38
MEZO_TEST_AFFILIATE_ADDRESS=0xSecondTestnetWalletAddress
MEZO_TEST_PURCHASE_MUSD=0.01
```

Important wallet setup:

- `MEZO_TESTNET_PRIVATE_KEY` is the buyer/deployer wallet.
- That wallet needs Mezo testnet gas.
- That wallet also needs enough real Mezo testnet MUSD for two purchases.
- `MEZO_TEST_AFFILIATE_ADDRESS` must be a different wallet address.
- The affiliate wallet does not need a private key in `.env`; it only receives MUSD commission.

Validation steps performed:

- Confirms the connected chain is `31611`.
- Confirms the registry uses official Mezo MUSD.
- Confirms the buyer wallet has enough MUSD.
- Creates a no-ref campaign through the deployed registry.
- Buys the no-ref campaign with official MUSD.
- Verifies a test affiliate through the registry owner.
- Creates a referred campaign.
- Buys through the affiliate address.
- Confirms the affiliate received the expected MUSD commission.
- Confirms affiliate reputation updated in the registry.

## Security Notes

Reentrancy:

- `purchase()` uses OpenZeppelin `ReentrancyGuard`.
- The code does not deploy a malicious token test contract because this project is intentionally tied to Mezo's official MUSD for hackathon validation.

ERC20 transfers:

- Uses OpenZeppelin `SafeERC20`.
- Handles ERC20 transfer failures safely.

Affiliate validation:

- Affiliate must be verified.
- Affiliate cannot be buyer.
- Affiliate cannot be creator.

Registry write protection:

- Only official campaigns deployed by the registry can call `recordPurchase`.

Private key safety:

- Never commit `.env`.
- Never share deployer private keys.
- If a private key is shown in a screenshot or chat, consider that wallet compromised and rotate to a new deployer.

## Known Limitations

- Affiliate verification is currently admin-controlled by the registry owner.
- The frontend currently displays newly created campaigns locally after deployment; a production version should index `CampaignCreated` events or read `getCampaigns()`.
- The registry owner is a normal wallet, not a multisig.
- Contract upgradeability is not included. This is intentional for hackathon simplicity and easier verification.
