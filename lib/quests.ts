/**
 * quests.ts
 * All daily quest definitions for Shelby Grow.
 */

import type { Quest } from '@/types'

export const QUESTS: Quest[] = [
  {
    id: 'daily_upload',
    icon: '📁',
    iconColor: 'orange',
    name: 'First Upload',
    description: 'Upload any file today',
    xpReward: 20,
    target: 1,
    progressKey: 'todayUploads',
  },
  {
    id: 'image_upload',
    icon: '📸',
    iconColor: 'blue',
    name: 'Image Keeper',
    description: 'Upload an image file',
    xpReward: 30,
    target: 1,
    progressKey: 'todayImages',
  },
  {
    id: 'streak_3',
    icon: '🔥',
    iconColor: 'purple',
    name: 'Streak Keeper',
    description: 'Maintain a 3+ day streak',
    xpReward: 50,
    target: 3,
    progressKey: 'streak',
  },
  {
    id: 'power_upload',
    icon: '⚡',
    iconColor: 'green',
    name: 'Power Stasher',
    description: 'Upload 3 files in one day',
    xpReward: 40,
    target: 3,
    progressKey: 'todayUploads',
  },
]
