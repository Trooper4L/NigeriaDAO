# Nigeria DAO Parliament

Nigeria DAO Parliament is a decentralized civic engagement platform that enables Nigerians to anonymously share opinions, propose civic initiatives, and vote on national matters with transparent blockchain-backed records.

This repository contains the frontend application scaffold built with Next.js App Router, Tailwind CSS, and Chakra UI.

## Vision

Build a secure, mobile-first civic portal that bridges:
- accessible citizen participation
- privacy-first interaction
- transparent, verifiable governance workflows

## Core Product Capabilities

- Anonymous identity entry (Firebase anonymous auth + optional Flow wallet pseudonyms)
- Opinion posting for text/image/video with IPFS/Filecoin storage
- Civic proposal lifecycle:
  - Draft
  - Public Discussion
  - Voting
  - Accepted / Rejected
- Anonymous voting with one-person-one-vote gating and Sybil resistance
- DAO governance with NDAO token, treasury proposals, and execution framework
- AI-assisted moderation with human override tools
- Social syndication to X, Facebook, Telegram, WhatsApp channels, and RSS
- National sentiment analytics and state-based insight surfaces
- Civic NFTs and participation badges

## Current Frontend Scope (Scaffolded)

- Global layout shell for secure dark UI
- Sticky `Anonymity Badge` header with protection status cues
- Mobile bottom navigation
- Parliament proposal feed inspired by governance dashboards
- Proposal cards with:
  - voting progress bars
  - support/against indicators
  - expandable metadata for CID and Flow hash

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI System:** Chakra UI
- **Accessibility primitives:** Radix UI (Accordion)
- **Icons:** Lucide
- **Typography:** IBM Plex Sans + Space Grotesk

**Integrated Services:**
- ✅ **Flow FCL** - Blockchain wallet and transaction interactions
- ✅ **Synapse SDK** - IPFS/Filecoin decentralized storage
- ✅ **Firebase** - Anonymous authentication + Firestore database
- ✅ **Cadence Smart Contracts** - On-chain governance and voting

## Design System

- Primary (Verified actions): `#008751` (Nigeria Green)
- Secondary (Blockchain tallies): `#00EF8B` (Flow Green/Blue family)
- Background: `#0B0E11` (Deep Space)

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  opinions/page.tsx
  proposals/page.tsx
  analytics/page.tsx
  dao/page.tsx
  globals.css
components/
  layout/
    anonymity-badge.tsx
    mobile-bottom-nav.tsx
  parliament/
    proposal-card.tsx
    proposal-feed.tsx
  opinions/
    opinion-form.tsx
    opinion-card.tsx
  proposals/
    create-proposal-form.tsx
  voting/
    vote-button.tsx
  analytics/
    analytics-dashboard.tsx
  dao/
    dao-token-display.tsx
  wallet/
    flow-wallet-connect.tsx
  providers/
    chakra-provider.tsx
lib/
  config/
    firebase.ts
    flow.ts
  services/
    auth.ts
    synapse.ts
    flow.ts
    opinion.ts
    proposal.ts
    analytics.ts
    dao.ts
  hooks/
    useAuth.ts
    useFlow.ts
  types/
    index.ts
cadence/
  contracts/
    OpinionRegistry.cdc
    ProposalRegistry.cdc
    VotingContract.cdc
    NDAOToken.cdc
    CivicNFT.cdc
data/
  proposals.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required credentials:
- **Firebase** - Create project at [Firebase Console](https://console.firebase.google.com/)
- **Synapse** - Filecoin Synapse SDK for decentralized storage
- **Flow** - Testnet configuration (pre-configured)

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup instructions.

### 3. Run development server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for production

```bash
npm run build
npm run start
```

## Product Roadmap

- **Phase 1 (✅ Completed):** 
  - ✅ Opinion posting with IPFS/Filecoin storage
  - ✅ Flow blockchain integration
  - ✅ Anonymous authentication
  - ✅ Civic proposals system
  - ✅ Voting system with smart contracts
  - ✅ Analytics dashboard
  - ✅ DAO governance tokens (NDAO)
  - ✅ Civic NFT badges

- **Phase 2 (In Progress):**
  - 🔄 AI moderation agent
  - 🔄 Social media syndication (X, Facebook, Telegram, WhatsApp)
  - 🔄 RSS feed generation
  - 🔄 Advanced regional analytics

- **Phase 3 (Planned):**
  - 📋 Mobile app (React Native)
  - 📋 Multi-language support (Yoruba, Igbo, Hausa)
  - 📋 Advanced DAO treasury management
  - 📋 Proposal execution framework

- **Phase 4 (Future):**
  - 📋 Mainnet deployment
  - 📋 Government API integrations
  - 📋 NGO partnership dashboard
  - 📋 Verified identity tier (optional)

## Non-Functional Goals

- Security: smart contract audits, anti-bot controls, rate limiting
- Privacy: no mandatory real identity, minimal personal data by default
- Performance: low-latency API interactions, IPFS pinning strategy, CDN caching
- Availability: 99.9% target with multi-region deployment strategy

## Contribution Flow

1. Create a feature branch from `main`
2. Make changes with focused commits
3. Open a Pull Request with:
   - summary
   - screenshots (if UI changes)
   - testing notes
   - linked issue/task context

## License

This project is licensed under the terms in [LICENSE](./LICENSE).
