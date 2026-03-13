'use client';

import { UploadRecord, useGameStore } from '@/store/useGameStore';
import { useEffect, useRef, useState } from 'react';

interface Props {
  record: UploadRecord;
  onClose: () => void;
}

export function ShareModal({ record, onClose }: Props) {
  const { unlockBadge, addXP } = useGameStore();
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Build share URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/view/${record.address}/${encodeURIComponent(record.blobName)}`;

  // Twitter/X share text
  const shareText = encodeURIComponent(
    `I just archived "${record.fileName}" permanently on @ShelbyProtocol — cryptographic proof of ownership, on-chain. 🌿\n\n${shareUrl}\n\n#ShelbyGrow #ContentVault #Web3`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Complete share quest
      // share quest removed
      if (true) {
        unlockBadge('sharer');
        addXP(shareQuest.xpReward);
      }
    });
  }

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const CATEGORY_ICONS: Record<string, string> = {
    creative: '🎨', study: '📚', photo: '📸',
    video: '🎬', document: '📄', audio: '🎵', other: '📦',
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="share-modal">
        <button className="share-modal__close" onClick={onClose}>✕</button>

        <div className="share-modal__header">
          <div className="share-modal__icon">🔗</div>
          <h2 className="share-modal__title">Share Proof of Ownership</h2>
          <p className="share-modal__subtitle">
            This link is cryptographic proof that you archived this file on-chain.
          </p>
        </div>

        {/* File info card */}
        <div className="share-modal__file-card">
          <div className="share-modal__file-thumb">
            {record.previewDataUrl ? (
              <img src={record.previewDataUrl} alt={record.fileName} />
            ) : (
              <span>{CATEGORY_ICONS[record.category] ?? '📦'}</span>
            )}
          </div>
          <div className="share-modal__file-info">
            <p className="share-modal__file-name">{record.fileName}</p>
            <p className="share-modal__file-meta">
              {CATEGORY_ICONS[record.category]} {record.category} · Archived{' '}
              {new Date(record.uploadedAt).toLocaleDateString([], {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* On-chain details */}
        <div className="share-modal__chain-info">
          <div className="share-modal__chain-row">
            <span className="share-modal__chain-label">Network</span>
            <span className="share-modal__chain-value">Shelby Network</span>
          </div>
          <div className="share-modal__chain-row">
            <span className="share-modal__chain-label">Owner</span>
            <span className="share-modal__chain-value share-modal__chain-value--mono">
              {record.address.slice(0, 8)}…{record.address.slice(-6)}
            </span>
          </div>
          <div className="share-modal__chain-row">
            <span className="share-modal__chain-label">Blob ID</span>
            <span className="share-modal__chain-value share-modal__chain-value--mono">
              {record.blobName.slice(0, 16)}…
            </span>
          </div>
        </div>

        {/* Share link */}
        <div className="share-modal__link-box">
          <input
            className="share-modal__link-input"
            readOnly
            value={shareUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button className="share-modal__copy-btn" onClick={copyLink}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>

        {/* Social share */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-modal__twitter-btn"
          onClick={() => {
            // share quest removed
            if (true) {
              unlockBadge('sharer');
              addXP(shareQuest.xpReward);
            }
          }}
        >
          🐦 Share on X / Twitter
        </a>

        <p className="share-modal__disclaimer">
          Anyone with this link can view the file metadata and on-chain proof.
          The actual file content remains on the Shelby Network.
        </p>
      </div>
    </div>
  );
}
