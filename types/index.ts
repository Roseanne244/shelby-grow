// ─── Core Types ──────────────────────────────────────────────────────────────

export interface User {
  address: string
  displayName: string
  joinedAt: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  blobId?: string          // Shelby blob ID (available after real SDK integration)
  txHash?: string          // Aptos transaction hash
  isImage: boolean
  xpEarned: number
}

export interface DayStreak {
  date: string             // ISO date string
  uploaded: boolean
  filesCount: number
}

export interface GameState {
  streak: number
  bestStreak: number
  lastUploadDate: string | null
  totalFiles: number
  totalXP: number
  level: number
  weeklyUploads: number
  weeklyXP: number
  todayUploads: number
  todayImages: number
  questsCompleted: number
  gardenAge: number
  streakHistory: DayStreak[]
}

// ─── Quest Types ──────────────────────────────────────────────────────────────

export type QuestId = 'daily_upload' | 'image_upload' | 'streak_3' | 'power_upload'

export interface Quest {
  id: QuestId
  icon: string
  iconColor: 'orange' | 'blue' | 'purple' | 'green'
  name: string
  description: string
  xpReward: number
  target: number
  progressKey: keyof GameState
}

export interface QuestProgress {
  questId: QuestId
  completedAt: string
  xpEarned: number
}

// ─── Badge Types ──────────────────────────────────────────────────────────────

export type BadgeId =
  | 'first_seed'
  | 'on_fire'
  | 'powered'
  | 'gardener'
  | 'champion'
  | 'diamond_hands'
  | 'early_adopter'
  | 'forest'

export interface Badge {
  id: BadgeId
  emoji: string
  name: string
  description: string
  unlockedAt?: string
}

// ─── Garden Types ─────────────────────────────────────────────────────────────

export type PlantType = 'bush' | 'tree' | 'flower'
export type PlantSize = 'small' | 'medium' | 'large'

export interface Plant {
  id: string
  type: PlantType
  size: PlantSize
  x: number
  color: string
  isToday: boolean
  uploadedAt: string
}

// ─── Leaderboard Types ────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  address: string
  displayName: string
  weeklyUploads: number
  weeklyXP: number
  streak: number
  badge?: string
  isCurrentUser?: boolean
}

// ─── Upload Store Types ───────────────────────────────────────────────────────

export interface UploadState {
  files: UploadedFile[]
  isUploading: boolean
  uploadProgress: number
  error: string | null
}

// ─── Shelby SDK Types (until official types are available) ────────────────────

export interface ShelbyUploadResult {
  blobId: string
  txHash: string
  size: number
  name: string
}

export interface ShelbyConfig {
  rpcUrl: string
  network: 'shelbynet' | 'mainnet'
  aptosNodeUrl: string
}
