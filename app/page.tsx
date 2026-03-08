import { StreakCard } from '@/components/modules/StreakCard'
import { UploadZone } from '@/components/modules/UploadZone'

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard />
        <div className="bg-card border border-[var(--border)] rounded-2xl p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
            📤 Upload to Shelby
          </p>
          <UploadZone />
        </div>
      </div>
    </main>
  )
}
