'use client';

import { FileTimeline } from '@/components/modules/FileTimeline';
import { UploadZone } from '@/components/modules/UploadZone';
import { WalletButton } from '@/components/modules/WalletButton';
import { useGameStore } from '@/store/useGameStore';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import Link from 'next/link';

const LEVEL_TITLES = [
  '', 'Seedling', 'Sprout', 'Sapling', 'Branch', 'Grove',
  'Forest', 'Ancient Tree', 'Canopy', 'Ecosystem', 'Legend',
];

export default function AppPage() {
  const { connected } = useWallet();
  const { xp, streak, uploads, badges, getLevel, getXPForNextLevel } = useGameStore();

  const level = getLevel();
  const xpForNext = getXPForNextLevel();
  const xpProgress = Math.min((xp / xpForNext) * 100, 100);
  const levelTitle = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] ?? 'Legend';
  const unlockedBadges = badges.filter((b) => b.unlockedAt);

  return (
    <div className="dash">
      {/* Nav */}
      <nav className="dash-nav">
        <Link href="/" className="dash-nav__logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" fill="#22c55e" opacity=".15"/>
            <path d="M9 5v4l2.5 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Shelby Grow
        </Link>
        <WalletButton />
      </nav>

      <div className="dash-body">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          {connected ? (
            <>
              {/* Level card */}
              <div className="sidebar-card sidebar-card--level">
                <div className="sidebar-card__label">Level {level}</div>
                <div className="sidebar-card__value">{levelTitle}</div>
                <div className="xp-bar">
                  <div className="xp-bar__fill" style={{ width: `${xpProgress}%` }} />
                </div>
                <div className="sidebar-card__sub">{xp.toLocaleString()} / {xpForNext.toLocaleString()} XP</div>
              </div>

              {/* Stats */}
              <div className="sidebar-stats">
                <div className="stat-pill">
                  <span className="stat-pill__num">{streak}</span>
                  <span className="stat-pill__label">Day streak</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill__num">{uploads.length}</span>
                  <span className="stat-pill__label">Archived</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill__num">{unlockedBadges.length}</span>
                  <span className="stat-pill__label">Badges</span>
                </div>
              </div>

              {/* Badges */}
              <div className="sidebar-section">
                <div className="sidebar-section__title">Badges</div>
                <div className="badge-row">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={`badge-pill ${b.unlockedAt ? 'badge-pill--on' : 'badge-pill--off'}`}
                      title={b.description}
                    >
                      {b.name}
                    </div>
                  ))}
                </div>
                {unlockedBadges.length === 0 && (
                  <p className="sidebar-section__empty">Upload your first file to unlock badges</p>
                )}
              </div>

              {/* How to earn XP */}
              <div className="sidebar-section">
                <div className="sidebar-section__title">How to earn XP</div>
                <div className="xp-guide">
                  <div className="xp-guide__row">
                    <span className="xp-guide__label">Any upload</span>
                    <span className="xp-guide__val">+50 XP</span>
                  </div>
                  <div className="xp-guide__row">
                    <span className="xp-guide__label">Creative or study file</span>
                    <span className="xp-guide__val">+100 XP</span>
                  </div>
                  <div className="xp-guide__row">
                    <span className="xp-guide__label">Daily streak bonus</span>
                    <span className="xp-guide__val">streak × 10</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="sidebar-connect">
              <p className="sidebar-connect__text">
                Connect your wallet to track XP, streaks, and badges.
              </p>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="dash-main">
          <section className="dash-section">
            <div className="dash-section__header">
              <h2 className="dash-section__title">Archive a file</h2>
              <p className="dash-section__sub">
                Store creative work or study materials on-chain — permanent, tamper-proof, yours.
              </p>
            </div>
            <UploadZone />
          </section>

          <div className="dash-divider" />

          <section className="dash-section">
            <div className="dash-section__header">
              <h2 className="dash-section__title">Archive timeline</h2>
              <p className="dash-section__sub">
                All your files on Shelby Network. Click the link icon to share proof of ownership.
              </p>
            </div>
            <FileTimeline />
          </section>
        </main>
      </div>
    </div>
  );
}
