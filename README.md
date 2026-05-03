# Kyndl — Permissionless Affiliate Payouts on Mezo

> Any creator. Any wallet. Every commission settled in MUSD the moment a sale happens.

**Kyndl** is a fully onchain affiliate marketing protocol built on [Mezo](https://mezo.org). Creators deploy product campaigns with a single transaction, set their own commission rates, and let anyone with a wallet promote their products. When a sale occurs, MUSD is automatically split between the creator and the affiliate in the same transaction — no delays, no middlemen, no payout thresholds.

**🏆 Hackathon Track:** MUSD Track (Supernormal dApps)

**🌐 Live Demo:** [kyndl.xyz](https://kyndl.xyz) (Mezo Testnet)

**📄 Deployed Contracts:**
| Contract | Address |
|---|---|
| KyndlRegistry | [`0x331721D9Cf63c40A7d429c15A4018066584E8e38`](https://explorer.test.mezo.org/address/0x331721D9Cf63c40A7d429c15A4018066584E8e38) |
| MUSD (Payment Token) | [`0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503`](https://explorer.test.mezo.org/address/0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503) |

---

## The Problem

Traditional affiliate marketing platforms have serious pain points:

- **Delayed payouts** — Affiliates wait 30–90 days for commissions
- **Opaque tracking** — No way to verify if sales are being counted fairly
- **High barriers** — Platforms require KYC, applications, and minimum thresholds
- **Trust dependency** — Creators must trust platforms to calculate and release payments honestly

Bitcoin holders who borrow MUSD through Mezo now have stable capital — but there are very few places to actually *spend* or *earn* MUSD in a meaningful way.

## The Solution

Kyndl makes affiliate marketing work the way it should:

1. **Creator deploys a campaign** — Name it, price it in MUSD, set the affiliate commission (e.g. 20%)
2. **Affiliates grab a referral link** — No signup, no approval. Just connect a wallet and share
3. **Buyer clicks the link and purchases** — Pays in MUSD
4. **Instant settlement** — The smart contract splits payment between creator and affiliate in a single transaction. Done.

Every step is transparent, verifiable, and requires zero trust between parties.

---

## How Kyndl Uses MUSD

MUSD is at the core of every transaction in Kyndl:

| Action | MUSD Role |
|---|---|
| **Pricing** | All product campaigns are priced in MUSD |
| **Payments** | Buyers pay in MUSD via ERC-20 approval + transfer |
| **Creator payouts** | The creator's share is sent directly to their wallet in MUSD |
| **Affiliate commissions** | The affiliate's cut is sent directly to their wallet in MUSD |
| **Reputation tracking** | Cumulative MUSD volume determines affiliate tier (Bronze → Silver → Gold) |

There is no intermediate token, no wrapping, and no conversion step. MUSD flows from buyer → smart contract → creator + affiliate, all in one transaction.

### Why MUSD Fits Perfectly

- **Stability** — Commissions are denominated in a stable unit, so affiliates know exactly what they'll earn
- **Bitcoin-aligned** — Users who borrow MUSD against their BTC can spend it on products or earn it back through affiliate commissions
- **Low friction** — MUSD is native to Mezo, so there are no bridging or swap steps required

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                 │
│                                                      │
│  Landing Page ─── Dashboard ─── Buy Page (Checkout)  │
│       │               │               │              │
│       │          ┌────┴────┐     ┌────┴────┐         │
│       │          │ Creator │     │  Buyer  │         │
│       │          │  Tab    │     │  Flow   │         │
│       │          ├─────────┤     ├─────────┤         │
│       │          │Affiliate│     │ MUSD    │         │
│       │          │  Tab    │     │ Approve │         │
│       │          └────┬────┘     │ + Buy   │         │
│       │               │         └────┬────┘         │
└───────┼───────────────┼──────────────┼──────────────┘
        │               │              │
   Wallet Connect   createCampaign()  purchase()
   (RainbowKit)         │              │
        │               ▼              ▼
┌───────┴──────────────────────────────────────────────┐
│              Mezo Testnet (Chain ID: 31611)           │
│                                                      │
│  ┌─────────────────┐    ┌─────────────────────────┐  │
│  │  KyndlRegistry  │───▶│  KyndlCampaign (per     │  │
│  │                 │    │  product, created via    │  │
│  │ • createCampaign│    │  factory pattern)        │  │
│  │ • recordPurchase│    │                          │  │
│  │ • reputation    │    │ • purchase(affiliate)    │  │
│  │   tracking      │    │ • MUSD split + transfer  │  │
│  └─────────────────┘    └─────────────────────────┘  │
│                                                      │
│  ┌──────────┐                                        │
│  │   MUSD   │  (ERC-20, used for all payments)       │
│  └──────────┘                                        │
└──────────────────────────────────────────────────────┘
```

---

## Smart Contracts

### KyndlRegistry

The central registry that manages all campaigns and tracks reputation.

**Key functions:**
- `createCampaign(name, metadataURI, price, affiliateBps)` — Deploys a new KyndlCampaign contract. Commission is set in basis points (e.g. 2000 = 20%)
- `recordPurchase(...)` — Called by campaign contracts after a sale to update reputation stats
- `setCampaignActive(campaign, active)` — Lets creators pause/unpause their campaigns
- `affiliateReputation(address)` / `creatorReputation(address)` — Returns cumulative sales, volume, and earnings

### KyndlCampaign

Each product gets its own contract, deployed automatically through the registry.

**Key functions:**
- `purchase(affiliate)` — The buyer calls this after approving MUSD. The contract:
  1. Transfers MUSD from the buyer
  2. Calculates the affiliate cut based on `affiliateBps`
  3. Sends the creator their share
  4. Sends the affiliate their commission
  5. Reports the sale back to the registry for reputation tracking

**Security:** Built with OpenZeppelin's `ReentrancyGuard` and `SafeERC20` to prevent common exploits.

---

## User Flows

### Creator Flow
1. Connect wallet on the landing page
2. Open the Dashboard → **Creator** tab
3. Click "Create Campaign" → enter product name, MUSD price, and commission %
4. Confirm the transaction — a new KyndlCampaign contract is deployed
5. Copy the campaign URL and share it with affiliates
6. Track sales, volume, and top affiliates from the dashboard

### Affiliate Flow
1. Connect wallet on the landing page
2. Open the Dashboard → **Affiliate** tab
3. Browse available campaigns and click "Get My Link"
4. Share the referral link (contains your wallet address as `?ref=0x...`)
5. When someone buys through your link, MUSD commission lands in your wallet instantly
6. Build reputation over time — tier badges (Bronze → Silver → Gold) based on cumulative volume

### Buyer Flow
1. Click an affiliate's referral link → lands on the checkout page
2. The referral address is automatically captured from the URL
3. Connect wallet and click "Buy Now"
4. Approve MUSD spending → confirm purchase transaction
5. MUSD is split and distributed in one transaction
6. View the transaction on Mezo Testnet Explorer

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Wallet | RainbowKit, wagmi v3, viem |
| Smart Contracts | Solidity 0.8.28, OpenZeppelin 5.x |
| Tooling | Hardhat 3 |
| Network | Mezo Testnet (Chain ID: 31611) |
| Payment Token | MUSD (ERC-20) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A wallet with Mezo Testnet funds ([Mezo Faucet](https://faucet.mezo.org))

### 1. Clone and install

```bash
git clone https://github.com/Anthonyushie/kyndl.git
cd kyndl
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required for wallet connect
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Pre-deployed contract addresses (already set in .env.example)
NEXT_PUBLIC_MUSD_ADDRESS=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
NEXT_PUBLIC_KYNDL_REGISTRY_ADDRESS=0x331721D9Cf63c40A7d429c15A4018066584E8e38
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Deploy your own contracts (optional)

If you want to deploy a fresh set of contracts to Mezo Testnet:

```bash
# Add your private key to .env.local
MEZO_TESTNET_PRIVATE_KEY=your_private_key

# Compile contracts
npm run contracts:compile

# Deploy to Mezo Testnet
npm run contracts:deploy:mezo

# Validate the deployment
npm run contracts:validate:mezo
```

The deploy script writes contract addresses to `deployments/mezo-testnet.json`.

---

## Project Structure

```
kyndl/
├── app/                     # Next.js app router pages
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Creator & Affiliate dashboard
│   ├── buy/[campaignId]/    # Product checkout page
│   └── layout.tsx           # Root layout with wallet providers
├── components/              # React components
│   ├── passport-button.tsx  # Wallet connect button
│   ├── settlement-showcase.tsx  # Settlement receipt examples
│   ├── features.tsx         # Creator & Affiliate feature cards
│   ├── hero.tsx             # Landing page hero section
│   └── ui/                  # Radix UI component library
├── contracts/               # Solidity smart contracts
│   ├── KyndlRegistry.sol    # Campaign factory + reputation
│   ├── KyndlCampaign.sol    # Per-product purchase + split logic
│   └── interfaces/          # Contract interfaces
├── lib/contracts/           # Frontend ABI definitions + addresses
├── scripts/                 # Hardhat deployment scripts
├── deployments/             # Deployed contract addresses
└── docs/                    # Additional documentation
```

---

## Hackathon Judging Alignment

### Mezo Integration (30%)
- MUSD is the **sole payment token** for the entire protocol — every campaign is priced, paid, and settled in MUSD
- Smart contracts deployed and verified on **Mezo Testnet**
- Wallet connection via RainbowKit configured for **Mezo chain**
- Transactions link to the **Mezo Testnet Explorer** for full transparency

### Technical Implementation (20%)
- **Factory pattern** — KyndlRegistry deploys individual KyndlCampaign contracts per product
- **Reentrancy protection** — OpenZeppelin's ReentrancyGuard on all payment flows
- **Safe token transfers** — SafeERC20 prevents silent transfer failures
- **Onchain reputation** — Cumulative sales/volume/earnings tracked per wallet at the contract level
- Clean separation between contract logic, frontend state, and wallet interactions

### Business Viability & Use Case (30%)
- Solves a real problem: affiliate payouts are broken (delayed, opaque, gatekept)
- Creates new utility for MUSD — turns it into a **working currency** for commerce
- Bitcoin holders who borrow MUSD can now both **spend** it (as buyers) and **earn** it (as affiliates)
- Revenue model: 3% flat platform fee per transaction (visible in settlement receipts)
- No barrier to entry for creators or affiliates — fully permissionless

### User Experience (10%)
- Clean, dark-themed UI with smooth transitions
- One-click campaign creation from the dashboard
- Affiliate referral links with automatic `?ref=` tracking
- Real-time checkout page with referral attribution display
- Settlement receipt visualization showing transparent payment splits

### Presentation Quality (10%)
- Live, working demo on Mezo Testnet at [kyndl.xyz](https://kyndl.xyz)
- Clear landing page explaining the value proposition
- Dashboard with both Creator and Affiliate views
- End-to-end flow: deploy → share → buy → settle

---

## What's Next

Kyndl is built to grow beyond the hackathon:

- **Mainnet deployment** — Move to Mezo mainnet when ready
- **Multi-tier affiliate chains** — Support second-level referrals (affiliate refers another affiliate)
- **Product delivery integration** — Unlock digital content after MUSD payment is confirmed
- **Analytics dashboard** — Deeper insights into conversion rates, top campaigns, and affiliate performance
- **Mezo Passport integration** — Use Passport identity for affiliate verification and reputation portability

---

## License

[MIT](./LICENSE)

---

Built for the **Bank on Bitcoin Hackathon** · Powered by [Mezo](https://mezo.org) · Settled in MUSD
