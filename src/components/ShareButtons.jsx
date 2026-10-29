'use client';

import { useState } from 'react';

export default function ShareButtons({ title, slug, category }) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-y border-neutral-900 my-8">
      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
        Share this Brief
      </span>

      <div className="flex items-center gap-3 flex-wrap">
        {/* X (Twitter) */}
        <a 
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-900 hover:bg-red-600 text-neutral-200 hover:text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition border border-neutral-800 hover:border-red-600 flex items-center gap-2"
        >
          <span>𝕏 Share</span>
        </a>

        {/* Facebook */}
        <a 
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-900 hover:bg-red-600 text-neutral-200 hover:text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition border border-neutral-800 hover:border-red-600 flex items-center gap-2"
        >
          <span>Facebook</span>
        </a>

        {/* Copy Link / Clipboard ready */}
        <button 
          onClick={handleCopy}
          className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition border border-neutral-800 flex items-center gap-2"
        >
          <span>{copied ? '✓ Copied Link!' : '🔗 Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}