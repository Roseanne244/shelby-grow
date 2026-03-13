# Shelby Grow

Shelby Grow is a file archiving application built on top of the Shelby Protocol. It allows users to register creative work and study materials on-chain, producing a cryptographically verifiable record of file ownership tied to a wallet address and block timestamp.

The application targets two primary use cases. The first is authorship provenance creators establishing a verifiable record of original work prior to publication, covering artwork, music, writing, and design assets. The second is permanent academic backup students anchoring notes, slides, and assignments to an immutable ledger that cannot be altered or deleted.

On top of the core archiving flow, the application includes a gamification layer (XP, daily streaks, badges) designed to build habitual usage and demonstrate real, sustained engagement with the network.

## Requirements

- Node.js 18+
- Petra or Pontem wallet browser extension, configured for Shelbynet
- A Shelbynet API key (available via the Shelby developer portal)

## Installation

```bash
npm install
```

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SHELBY_API_KEY=your_key_here
```

Then start the development server:

```bash
npm run dev
```

The application is available at `localhost:3000`. The dashboard is at `localhost:3000/app`.

## Architecture

File registration is handled by `hooks/useUpload.ts`, which wraps the Shelby SDK's `putBlob` call. On upload, the SDK signs a transaction with the connected wallet that anchors the file's merkle root to the user's address on Shelby Network. The transaction returns a `blobName` identifier, which is persisted to local state and used to construct a public certificate URL.

Certificate pages at `/view/[address]/[blobName]` are publicly accessible and statically renderable. Anyone with the URL can independently verify the wallet address, file hash, and registration timestamp.

Client state upload history, XP, streaks, and badges is managed with Zustand and persisted to `localStorage` under the key `shelby-grow-game-v3`. No backend or database is required.

## Project structure

```
app/
  page.tsx                              marketing landing page
  app/page.tsx                          authenticated dashboard
  view/[address]/[blobName]/page.tsx    public file certificate

components/
  landing/        landing page sections
  modules/        UploadZone, FileTimeline, ShareModal, WalletButton
  providers/      WalletProvider wrapping the Aptos wallet adapter

store/
  useGameStore.ts   XP accumulation, streak tracking, badge unlock logic

hooks/
  useUpload.ts      Shelby SDK integration and upload state management
```

## Known issues

The `putBlob` RPC endpoint on Shelbynet intermittently returns HTTP 500. In these cases the on-chain transaction has already confirmed the error originates from the data layer of the RPC node, not from the transaction itself. The application catches this error, sets a `rpcWarning` flag on the result, and continues treating the upload as successful. The file remains registered on-chain regardless.

The leaderboard on the landing page is static placeholder data. A live implementation requires a Shelby indexer capable of querying cumulative bytes stored per address within a rolling weekly window. This will be wired up once indexer access is available on Shelbynet.
