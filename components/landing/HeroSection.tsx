'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Video load + fade loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const FADE = 0.8;
    let raf = 0;

    video.src = VIDEO_URL;
    video.load();

    function tick() {
      const { currentTime: t, duration: d } = video!;
      if (d > 0) {
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (t > d - FADE) o = (d - t) / FADE;
        video!.style.opacity = String(Math.max(0, Math.min(1, o)));
      }
      raf = requestAnimationFrame(tick);
    }

    const onPlay = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const onEnded = () => {
      cancelAnimationFrame(raf);
      video!.style.opacity = '0';
      setTimeout(() => { video!.currentTime = 0; video!.play().catch(() => {}); }, 120);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('ended', onEnded);
    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  // ── Parallax
  useEffect(() => {
    const video = videoRef.current;
    const content = document.querySelector<HTMLElement>('.hero-content');
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!video || !content || !hero) return;

    function onScroll() {
      const s = window.scrollY;
      const h = hero!.offsetHeight;
      if (s > h) return;
      video!.style.transform = `translateY(${s * 0.4}px)`;
      content!.style.transform = `translateY(${s * 0.18}px)`;
      content!.style.opacity = String(Math.max(0, 1 - s / (h * 0.65)));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Stats count-up
  useEffect(() => {
    function countUp(id: string, target: number, suffix: string, dur: number) {
      const el = document.getElementById(id);
      if (!el) return;
      const start = performance.now();
      function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }
    const t = setTimeout(() => {
      countUp('stat-onchain', 100, '%', 1600);
      countUp('stat-wallets', 2, '', 900);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        playsInline
        loop
        style={{ opacity: 0 }}
      />
      <div className="hero-overlay" />
      <div className="hero-glow-bottom" />

      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" className="logo">
            <span className="logo-icon"><span className="logo-dot" /></span>
            Shelby Grow
          </Link>
          <ul className="nav-links">
            <li><a href="#how-it-works">How it Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
        </div>
        <Link href="/app" className="btn-pill-nav">
          <span className="btn-pill-nav-inner">Launch App</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="hero-content">
        <div className="badge">
          <span className="badge-dot" />
          <span className="badge-muted">Now live on Shelby Network</span>
          &nbsp;— Free to start
        </div>

        <h1 className="hero-heading">
          Grow your archive.<br />Every single day.
        </h1>

        <p className="hero-subtitle">
          Store creative work and study files on-chain — permanent proof of ownership,
          cryptographically verifiable. Earn XP, build streaks, unlock badges.
        </p>

        <div className="hero-ctas">
          <Link href="/app" className="btn-pill-cta">
            <span className="btn-pill-cta-inner">Start Archiving</span>
          </Link>
          <a href="#how-it-works" className="btn-pill-ghost">
            <span className="btn-pill-ghost-inner">How it works</span>
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-val" id="stat-onchain">0%</span>
            <span className="hero-stat-label">On-chain</span>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <span className="hero-stat-val" id="stat-wallets">0</span>
            <span className="hero-stat-label">Wallets supported</span>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <span className="hero-stat-val">Free</span>
            <span className="hero-stat-label">To start</span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
