/**
 * useGameStore.ts
 *
 * Central Zustand store for all game state:
 * streak, XP, level, quests, badges, and garden.
 *
 * Persisted to localStorage so state survives page refreshes.
 * When Shelby SDK is integrated, streak + scores will also
 * be written to Shelby Storage as permanent on-chain records.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, QuestProgress, Badge, BadgeId } from '@/types'
import { QUESTS } from '@/lib/quests'
import { BADGES } from '@/lib/badges'

// ─── XP thresholds per level ──────────────────────────────────────────────────
export function getXPForLevel(level: number): number {
  return level * 100
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Quest state
  todayQuestProgress: QuestProgress[]
  unlockedBadges: Badge[]

  // Actions
  recordUpload: (params: { fileCount: number; hasImage: boolean; totalSizeBytes: number }) => void
  addXP: (amount: number) => void
  checkAndCompleteQuests: () => void
  checkAndUnlockBadges: () => void
  resetDailyState: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      streak: 0,
      bestStreak: 0,
      lastUploadDate: null,
      totalFiles: 0,
      totalXP: 0,
      level: 1,
      weeklyUploads: 0,
      weeklyXP: 0,
      todayUploads: 0,
      todayImages: 0,
      questsCompleted: 0,
      gardenAge: 0,
      streakHistory: [],
      todayQuestProgress: [],
      unlockedBadges: [
        // Early adopter badge — everyone who uses the app gets this
        { ...BADGES.find(b => b.id === 'early_adopter')!, unlockedAt: new Date().toISOString() },
      ],

      // ── Actions ────────────────────────────────────────────────────────────

      recordUpload: ({ fileCount, hasImage, totalSizeBytes }) => {
        const state = get()
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        // Update streak
        let newStreak = state.streak
        if (state.lastUploadDate !== today) {
          if (state.lastUploadDate === yesterday) {
            newStreak = state.streak + 1
          } else {
            newStreak = 1
          }
        }

        // Calculate XP for this upload
        const baseXP = 10 * fileCount
        const sizeXP = Math.floor(totalSizeBytes / 102400)
        const xpGained = baseXP + sizeXP

        // Update streak history
        const todayHistory = { date: today, uploaded: true, filesCount: fileCount }
        const existingHistory = state.streakHistory.filter(h => h.date !== today)

        set({
          streak: newStreak,
          bestStreak: Math.max(newStreak, state.bestStreak),
          lastUploadDate: today,
          totalFiles: state.totalFiles + fileCount,
          weeklyUploads: state.weeklyUploads + fileCount,
          todayUploads: state.todayUploads + fileCount,
          todayImages: state.todayImages + (hasImage ? 1 : 0),
          gardenAge: state.gardenAge + 1,
          streakHistory: [...existingHistory, todayHistory].slice(-30), // keep last 30 days
        })

        get().addXP(xpGained)
        get().checkAndCompleteQuests()
        get().checkAndUnlockBadges()
      },

      addXP: (amount: number) => {
        const state = get()
        const newXP = state.totalXP + amount
        const xpForNextLevel = getXPForLevel(state.level)
        const newLevel = newXP >= xpForNextLevel ? state.level + 1 : state.level

        set({
          totalXP: newXP,
          weeklyXP: state.weeklyXP + amount,
          level: newLevel,
        })
      },

      checkAndCompleteQuests: () => {
        const state = get()
        const today = new Date().toDateString()
        const newCompletions: QuestProgress[] = []

        for (const quest of QUESTS) {
          const alreadyDone = state.todayQuestProgress.some(p => p.questId === quest.id)
          if (alreadyDone) continue

          const currentValue = state[quest.progressKey as keyof GameState] as number ?? 0
          if (currentValue >= quest.target) {
            newCompletions.push({
              questId: quest.id,
              completedAt: new Date().toISOString(),
              xpEarned: quest.xpReward,
            })
            get().addXP(quest.xpReward)
          }
        }

        if (newCompletions.length > 0) {
          set({
            todayQuestProgress: [...state.todayQuestProgress, ...newCompletions],
            questsCompleted: state.questsCompleted + newCompletions.length,
          })
        }
      },

      checkAndUnlockBadges: () => {
        const state = get()
        const newBadges: Badge[] = []

        for (const badge of BADGES) {
          const alreadyUnlocked = state.unlockedBadges.some(b => b.id === badge.id)
          if (alreadyUnlocked) continue
          if (badge.condition(state)) {
            newBadges.push({ ...badge, unlockedAt: new Date().toISOString() })
          }
        }

        if (newBadges.length > 0) {
          set({ unlockedBadges: [...state.unlockedBadges, ...newBadges] })
        }
      },

      resetDailyState: () => {
        set({ todayUploads: 0, todayImages: 0, todayQuestProgress: [] })
      },
    }),
    {
      name: 'shelby-grow-game',
      // Only persist what's needed — don't persist derived UI state
      partialize: (state) => ({
        streak: state.streak,
        bestStreak: state.bestStreak,
        lastUploadDate: state.lastUploadDate,
        totalFiles: state.totalFiles,
        totalXP: state.totalXP,
        level: state.level,
        weeklyUploads: state.weeklyUploads,
        weeklyXP: state.weeklyXP,
        todayUploads: state.todayUploads,
        todayImages: state.todayImages,
        questsCompleted: state.questsCompleted,
        gardenAge: state.gardenAge,
        streakHistory: state.streakHistory,
        todayQuestProgress: state.todayQuestProgress,
        unlockedBadges: state.unlockedBadges,
      }),
    }
  )
)
