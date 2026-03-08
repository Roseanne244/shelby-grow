'use client'

import { useGameStore } from '@/store/useGameStore'
import { isSameDay, subDays, format } from 'date-fns'

export function StreakCard() {
  const { streak, bestStreak, streakHistory } = useGameStore()

  // Build last 7 days display
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = date.toDateString()
    const history = streakHistory.find((h) => h.date === dateStr)
    const isToday = isSameDay(date, new Date())

    return {
      label: format(date, 'EEE')[0], // M, T, W, etc.
      uploaded: history?.uploaded ?? false,
      isToday,
    }
  })

  return (
    <div className="bg-card border border-[var(--border)] rounded-2xl p-6 text-center">
      {/* Label */}
      <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
        🔥 Daily Streak
      </p>

      {/* Flame + Number */}
      <div className="animate-flame inline-block text-5xl mb-1">🔥</div>
      <div className="font-mono text-5xl font-bold text-orange leading-none mb-1">
        {streak}
      </div>
      <p className="text-sm text-muted mb-5">days in a row</p>

      {/* 7-day dots */}
      <div className="flex justify-center gap-2 mb-5">
        {last7Days.map((day, i) => (
          <div
            key={i}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-[10px] font-mono font-bold transition-all
              ${day.uploaded
                ? 'bg-orange text-black shadow-[0_0_10px_rgba(255,106,0,0.4)]'
                : day.isToday
                  ? 'border-2 border-orange text-orange'
                  : 'bg-[var(--border)] text-muted'
              }
            `}
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* Best streak */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-muted">Best:</span>
        <span className="font-mono text-sm font-bold text-white">{bestStreak} days</span>
      </div>

      <p className="text-xs text-muted mt-3">Upload a file today to keep your streak!</p>
    </div>
  )
}
