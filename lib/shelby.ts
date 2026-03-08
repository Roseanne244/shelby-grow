/**
 * shelby.ts
 *
 * Shelby Protocol SDK integration layer.
 *
 * NOTE: Methods marked [PROTOTYPE] simulate behavior locally.
 * Once Shelby early access is granted, replace with real SDK calls.
 * All function signatures will remain identical — only the implementation changes.
 *
 * SDK Docs: https://docs.shelby.xyz/sdks/typescript
 */

import type { ShelbyConfig, ShelbyUploadResult, UploadedFile } from '@/types'

// ─── Config ───────────────────────────────────────────────────────────────────

export const SHELBY_CONFIG: ShelbyConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_SHELBY_RPC_URL ?? 'https://api.shelbynet.shelby.xyz/shelby',
  network: (process.env.NEXT_PUBLIC_SHELBY_NETWORK as 'shelbynet' | 'mainnet') ?? 'shelbynet',
  aptosNodeUrl: process.env.NEXT_PUBLIC_APTOS_NODE_URL ?? 'https://api.shelbynet.shelby.xyz/v1',
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a file to Shelby network.
 *
 * [PROTOTYPE] — Simulates upload with artificial delay.
 * [REAL SDK]  — Will use @shelby-protocol/sdk to:
 *   1. Compute erasure coding locally (Clay Codes, 10+6 chunks)
 *   2. Calculate cryptographic commitments per chunk
 *   3. Submit blob metadata + merkle root to Aptos on-chain
 *   4. Distribute erasure-coded chunks to Storage Providers
 *   5. Return blobId + txHash once blob is confirmed "written"
 */
export async function uploadToShelby(
  file: File,
  walletAddress: string,
  onProgress?: (progress: number) => void
): Promise<ShelbyUploadResult> {
  // [PROTOTYPE] Simulate upload progress
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 8
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        onProgress?.(100)

        // Simulate returned blob metadata
        resolve({
          blobId: `0x${Math.random().toString(16).slice(2, 18)}`,
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          size: file.size,
          name: file.name,
        })
      } else {
        onProgress?.(Math.floor(progress))
      }
    }, 80)
  })

  /**
   * [REAL SDK IMPLEMENTATION — uncomment when early access is granted]
   *
   * import { ShelbyClient } from '@shelby-protocol/sdk'
   *
   * const client = new ShelbyClient({
   *   rpcUrl: SHELBY_CONFIG.rpcUrl,
   *   network: SHELBY_CONFIG.network,
   * })
   *
   * const result = await client.upload({
   *   file,
   *   name: `${walletAddress}/${Date.now()}/${file.name}`,
   *   wallet: walletAddress,
   *   onProgress,
   * })
   *
   * return {
   *   blobId: result.blobId,
   *   txHash: result.txHash,
   *   size: file.size,
   *   name: file.name,
   * }
   */
}

// ─── Fetch blobs by wallet address ────────────────────────────────────────────

/**
 * Retrieve all blobs uploaded by a given Aptos wallet address.
 *
 * [PROTOTYPE] — Returns empty array (no real network).
 * [REAL SDK]  — Will query Shelby RPC for blobs under this address namespace.
 */
export async function getBlobsByAddress(address: string): Promise<UploadedFile[]> {
  // [PROTOTYPE]
  return []

  /**
   * [REAL SDK IMPLEMENTATION]
   *
   * import { ShelbyClient } from '@shelby-protocol/sdk'
   *
   * const client = new ShelbyClient({ rpcUrl: SHELBY_CONFIG.rpcUrl })
   * const blobs = await client.listBlobs({ address })
   *
   * return blobs.map(blob => ({
   *   id: blob.blobId,
   *   name: blob.name,
   *   size: blob.size,
   *   type: blob.mimeType ?? '',
   *   uploadedAt: blob.createdAt,
   *   blobId: blob.blobId,
   *   txHash: blob.txHash,
   *   isImage: blob.mimeType?.startsWith('image/') ?? false,
   *   xpEarned: calculateXP(blob.size),
   * }))
   */
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calculate XP earned from a file upload.
 * Base: 10 XP per upload + 1 XP per 100KB.
 */
export function calculateXP(fileSizeBytes: number): number {
  const base = 10
  const sizeBonus = Math.floor(fileSizeBytes / 102400) // 1 XP per 100KB
  return base + sizeBonus
}

/**
 * Format file size to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/**
 * Get file emoji icon based on MIME type.
 */
export function getFileIcon(mimeType: string): string {
  if (!mimeType) return '📄'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.includes('pdf')) return '📕'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return '📦'
  if (mimeType.includes('text')) return '📝'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
  return '📄'
}

/**
 * Shorten Aptos wallet address for display.
 * e.g. 0x1234...5678
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Get Shelby block explorer URL for a blob or transaction.
 */
export function getExplorerUrl(type: 'blob' | 'tx', id: string): string {
  const base = 'https://explorer.shelby.xyz/shelbynet'
  if (type === 'tx') return `${base}/tx/${id}`
  return `${base}/blob/${id}`
}
