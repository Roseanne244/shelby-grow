/**
 * badges.ts
 * All achievement badge definitions for Shelby Grow.
 */

import type { Badge, GameState } from '@/types'

interface BadgeDefinition extends Omit<Badge, 'unlockedAt'> {
  condition: (state: GameState) => boolean
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_seed',
    emoji: '🌱',
    name: 'First Seed',
    description: 'Upload your first file',
    condition: (s) => s.totalFiles >= 1,
  },
  {
    id: 'on_fire',
    emoji: '🔥',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
    condition: (s) => s.streak >= 3,
  },
  {
    id: 'powered',
    emoji: '⚡',
    name: 'Powered',
    description: 'Reach 100 XP',
    condition: (s) => s.totalXP >= 100,
  },
  {
    id: 'gardener',
    emoji: '🌿',
    name: 'Gardener',
    description: '10 plants in your garden',
    condition: (s) => s.totalFiles >= 10,
  },
  {
    id: 'champion',
    emoji: '🏆',
    name: 'Champion',
    description: 'Reach top 3 in Storage Wars',
    condition: () => false, // Unlocked server-side when leaderboard confirms rank
  },
  {
    id: 'diamond_hands',
    emoji: '💎',
    name: 'Diamond Hands',
    description: 'Maintain a 30-day streak',
    condition: (s) => s.streak >= 30,
  },
  {
    id: 'early_adopter',
    emoji: '🚀',
    name: 'Early Adopter',
    description: 'Join Shelby Grow early access',
    condition: () => true, // Everyone gets this
  },
  {
    id: 'forest',
    emoji: '🌳',
    name: 'Forest',
    description: 'Upload 50 files total',
    condition: (s) => s.totalFiles >= 50,
  },
]
