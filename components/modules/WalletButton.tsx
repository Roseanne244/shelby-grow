'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';

export function WalletButton() {
  const { connected, account, connect, disconnect, wallets, wallet } = useWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowWalletList(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const shortAddr = account?.address
    ? account.address.toString().slice(0, 6) + '...' + account.address.toString().slice(-4)
    : '';

  if (connected && account) {
    return (
      <div className="wallet-btn-wrap" ref={menuRef}>
        <button
          className="wallet-btn wallet-btn--connected"
          onClick={() => setShowMenu((v) => !v)}
        >
          <span className="wallet-btn__dot" />
          <span className="wallet-btn__addr">{shortAddr}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {showMenu && (
          <div className="wallet-menu">
            <div className="wallet-menu__info">
              <span className="wallet-menu__label">Connected via</span>
              <span className="wallet-menu__wallet-name">{wallet?.name ?? 'Wallet'}</span>
            </div>
            <div className="wallet-menu__addr">{shortAddr}</div>
            <div className="wallet-menu__divider" />
            <button
              className="wallet-menu__item wallet-menu__item--danger"
              onClick={() => { disconnect(); setShowMenu(false); }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wallet-btn-wrap" ref={menuRef}>
      <button
        className="wallet-btn wallet-btn--disconnected"
        onClick={() => setShowWalletList((v) => !v)}
      >
        Connect Wallet
      </button>

      {showWalletList && (
        <div className="wallet-menu">
          <div className="wallet-menu__label" style={{ padding: '12px 16px 8px' }}>
            Choose wallet
          </div>
          <div className="wallet-menu__divider" />
          {wallets && wallets.length > 0 ? (
            wallets.map((w) => (
              <button
                key={w.name}
                className="wallet-menu__item"
                onClick={() => {
                  connect(w.name);
                  setShowWalletList(false);
                }}
              >
                {w.icon && (
                  <img src={w.icon} alt={w.name} className="wallet-menu__icon" />
                )}
                {w.name}
                {w.readyState === 'NotDetected' && (
                  <span className="wallet-menu__not-installed">Not installed</span>
                )}
              </button>
            ))
          ) : (
            <>
              <a
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-menu__item"
              >
                Petra
                <span className="wallet-menu__not-installed">Install</span>
              </a>
              <a
                href="https://pontem.network/pontem-wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-menu__item"
              >
                Pontem
                <span className="wallet-menu__not-installed">Install</span>
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
