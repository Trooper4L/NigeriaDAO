# Nigeria DAO Parliament

Nigeria DAO Parliament is a decentralized civic engagement platform for anonymous opinion sharing, civic proposals, and transparent public voting with blockchain-backed proof records.

## Product Intent

- Enable anonymous national civic discourse
- Provide immutable proof of opinions and votes
- Store civic data on Filecoin/IPFS
- Support transparent, censorship-resistant participation

## Current Frontend Scope

This repository currently provides a polished, mobile-first frontend foundation with:

- Secure global layout and dark visual system
- Sticky anonymity/security header
- Desktop sidebar navigation + mobile bottom navigation
- Home dashboard with civic status cards
- Parliament page (proposal creation, lifecycle, vote actions)
- Opinions page (publishing, moderation states, social share links)
- Analytics page (national and state sentiment summaries)
- Governance page (treasury initiative view + voting entrypoint)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Chakra UI
- Framer Motion
- Lucide Icons

## Nigeria DAO Data Layer (Frontend Simulation)

The app includes a local civic state provider for development:

- Anonymous alias identity generation
- Proposal lifecycle transitions:
  - Draft
  - Public Discussion
  - Voting
  - Accepted / Rejected
- One-person-one-vote enforcement per identity
- Opinion moderation status pipeline
- Deterministic proof simulation:
  - CID-like hash
  - Flow-style transaction hash
- `localStorage` persistence

This simulation is a temporary frontend layer before full Firebase + Flow + IPFS backend integration.

## Design Tokens

- Nigeria Green: `#008751`
- Flow Accent: `#00EF8B`
- Deep Space background: `#0B0E11`

## Project Structure

```text
app/
  analytics/page.tsx
  governance/page.tsx
  opinions/page.tsx
  parliament/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  layout/
    anonymity-badge.tsx
    desktop-sidebar.tsx
    mobile-bottom-nav.tsx
  providers/
    chakra-provider.tsx
    civic-provider.tsx
  ui/
    motion-box.tsx
lib/
  civic-engine.ts
  civic-types.ts
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Roadmap Alignment

- Phase 1: Opinion posting + proof foundations (frontend simulation complete, backend integration pending)
- Phase 2: Proposal voting + syndication workflows (frontend experience in progress)
- Phase 3: AI moderation + analytics depth (baseline in place)
- Phase 4: Full DAO governance execution (pending smart contracts and treasury integration)

## License

See [LICENSE](./LICENSE).
