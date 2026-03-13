import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileCategory =
  | 'creative'
  | 'study'
  | 'photo'
  | 'video'
  | 'document'
  | 'audio'
  | 'other';

export interface UploadRecord {
  id: string;
  fileName: string;
  fileSize: number;
  category: FileCategory;
  blobName: string;
  address: string;
  uploadedAt: number;
  mimeType: string;
  previewDataUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

interface GameState {
  xp: number;
  streak: number;
  lastUploadDate: string | null;
  uploads: UploadRecord[];
  badges: Badge[];

  addXP: (amount: number) => void;
  recordUpload: (record: UploadRecord) => void;
  unlockBadge: (badgeId: string) => void;
  updateStreak: () => void;
  getLevel: () => number;
  getXPForNextLevel: () => number;
}

const INITIAL_BADGES: Badge[] = [
  { id: 'pioneer',    name: 'Pioneer',      description: 'One of the first to archive on Shelby',  icon: '🚀' },
  { id: 'creator',    name: 'Creator',       description: 'Archived creative work on-chain',         icon: '🎨' },
  { id: 'scholar',    name: 'Scholar',       description: 'Backed up study materials forever',       icon: '🎓' },
  { id: 'consistent', name: 'Consistent',    description: 'Maintained a 7-day streak',               icon: '🔥' },
  { id: 'archivist',  name: 'Archivist',     description: 'Archived 5 files on Shelby',              icon: '🗂️' },
  { id: 'vault',      name: 'Vault Master',  description: 'Archived 20 files on Shelby',             icon: '🏛️' },
  { id: 'sharer',     name: 'Proof Sender',  description: 'Shared on-chain proof of ownership',      icon: '🔗' },
];

function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function getXPForNextLevel(xp: number): number {
  const level = getLevel(xp);
  return level * level * 100;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastUploadDate: null,
      uploads: [],
      badges: INITIAL_BADGES,

      getLevel: () => getLevel(get().xp),
      getXPForNextLevel: () => getXPForNextLevel(get().xp),

      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

      recordUpload: (record) => {
        const state = get();
        const uploads = [record, ...state.uploads];
        set({ uploads });

        let xpGained = 50; // base XP per upload

        // Unlock badges based on category & total uploads
        let badges = [...state.badges];
        const unlock = (id: string) => {
          badges = badges.map((b) =>
            b.id === id && !b.unlockedAt ? { ...b, unlockedAt: Date.now() } : b
          );
        };

        if (uploads.length === 1) unlock('pioneer');
        if (record.category === 'creative') { unlock('creator'); xpGained += 50; }
        if (record.category === 'study')    { unlock('scholar'); xpGained += 50; }
        if (uploads.length >= 5)  unlock('archivist');
        if (uploads.length >= 20) unlock('vault');

        set({ badges, xp: state.xp + xpGained });
        get().updateStreak();
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        if (state.lastUploadDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = state.lastUploadDate === yesterday ? state.streak + 1 : 1;

        let xpGained = newStreak * 10; // streak bonus XP

        // Unlock consistent badge at 7-day streak
        let badges = state.badges;
        if (newStreak >= 7) {
          badges = badges.map((b) =>
            b.id === 'consistent' && !b.unlockedAt ? { ...b, unlockedAt: Date.now() } : b
          );
        }

        set({ streak: newStreak, lastUploadDate: today, badges, xp: state.xp + xpGained });
      },

      unlockBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.unlockedAt ? { ...b, unlockedAt: Date.now() } : b
          ),
        })),
    }),
    { name: 'shelby-grow-game-v3' }
  )
);
