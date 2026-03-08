# 🌱 Shelby Grow

> Gamified daily storage app built on top of the Shelby Protocol.

[![Built on Shelby](https://img.shields.io/badge/Built%20on-Shelby-ff6a00?style=flat-square)](https://shelby.xyz)
[![Aptos](https://img.shields.io/badge/Chain-Aptos-4f8aff?style=flat-square)](https://aptoslabs.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-000?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?style=flat-square)](https://typescriptlang.org)

---

## 💡 What is Shelby Grow?

Most people never think about where their files live. Shelby Grow changes that.

Inspired by how Duolingo turned language learning into a daily ritual, **Shelby Grow turns file storage into a game** — with real stakes and real rewards. Every upload is a move in a larger game. Every day you store something, your streak grows. Every file plants a seed in your garden.

This isn't just a UI on top of a storage protocol. It's a behavior design system that turns Shelby's infrastructure into something people genuinely want to use every day.

---

## ⚙️ Core Mechanics

### 🔥 Daily Streak
Upload at least one file per day to keep your streak alive. Miss a day and it resets to zero. Simple, addictive, and it drives consistent recurring activity on the Shelby network.

### 🌱 Storage Garden
Every file you upload grows a plant in your personal garden. Small files grow bushes. Large files grow trees. Your garden is a living, visual representation of your entire storage history on Shelby — permanently recorded on-chain.

### 🗺️ Daily Quests
Each day brings different upload challenges: upload an image, upload a file over 1MB, upload 3 files in one session. Completing quests earns XP, unlocks badges, and keeps the experience fresh across every session.

### 🏆 Storage Wars
A weekly leaderboard where users compete for who uploads the most data. Resets every Monday. Turns individual usage into community competition — the kind of thing people screenshot and share.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Wallet | Aptos Wallet Adapter + Petra |
| Storage | Shelby Protocol TypeScript SDK |
| Database | Supabase (leaderboard + metadata) |
| Deploy | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Petra Wallet browser extension
- Shelby Protocol early access API key

### Installation

```bash
git clone https://github.com/yourusername/shelby-grow
cd shelby-grow
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_SHELBY_RPC_URL=https://api.shelbynet.shelby.xyz/shelby
NEXT_PUBLIC_SHELBY_NETWORK=shelbynet
NEXT_PUBLIC_APTOS_NODE_URL=https://api.shelbynet.shelby.xyz/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
shelby-grow/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout + providers
│   ├── page.tsx                # Home / Dashboard
│   ├── dashboard/              # Main dashboard
│   ├── garden/                 # Storage Garden page
│   ├── quests/                 # Daily Quests page
│   ├── wars/                   # Storage Wars leaderboard
│   └── profile/                # User profile + badges
├── components/
│   ├── providers/
│   │   ├── WalletProvider.tsx  # Aptos wallet adapter
│   │   └── QueryProvider.tsx   # React Query setup
│   ├── modules/
│   │   ├── StreakCard.tsx       # Daily streak display
│   │   ├── UploadZone.tsx      # File upload + Shelby SDK
│   │   ├── GardenCanvas.tsx    # Canvas-based garden
│   │   ├── QuestList.tsx       # Daily quests
│   │   ├── Leaderboard.tsx     # Storage Wars table
│   │   └── BadgeGrid.tsx       # Achievement badges
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Toast.tsx
│       └── ProgressBar.tsx
├── lib/
│   ├── shelby.ts               # Shelby SDK integration
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Helpers + formatters
├── store/
│   ├── useGameStore.ts         # Streak, XP, level state
│   └── useUploadStore.ts       # Upload history state
├── types/
│   └── index.ts                # Shared TypeScript types
└── .env.example                # Environment variables template
```

---

## 🔗 Shelby Protocol Integration

When Shelby early access is active, every upload in Shelby Grow:

1. Triggers a real write to the Shelby network via TypeScript SDK
2. Submits blob metadata + merkle root as an Aptos transaction
3. Processes storage payment through Shelby's micropayment channels
4. Confirms blob as "written" via smart contract state

Streaks and leaderboard scores are stored as permanent on-chain records — every game interaction becomes a real Shelby network event.

---

## 🗺️ Roadmap

- [x] Browser prototype (single HTML — all 4 mechanics)
- [ ] Next.js project scaffold
- [ ] Petra wallet connect
- [ ] Shelby SDK upload integration
- [ ] On-chain streak records
- [ ] Real-time leaderboard via Supabase
- [ ] Tournament mode
- [ ] Token-gated levels

---

## 📄 License

MIT — built with ❤️ on Shelby Protocol.
