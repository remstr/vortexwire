'use client';

import { useState } from 'react';

export default function ShareButtons({ title, slug, category }) {
  const [copied, setCopied] = useState(false);
  
  // Explicitly build the full canonical article URL using category and slug
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vortexwire.vercel.app';
  const shareUrl = category && slug ? `${baseUrl}/${category.toLowerCase()}/${slug.toLowerCase()}` : (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Check out this brief on VortexWire: " + shareUrl)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}`;

  return (
    <div className="py-2">
      <div className="flex items-center space-x-3">
        {/* Facebook */}
        <a 
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition shadow-md"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>

        {/* Email */}
        <a 
          href={emailShareUrl}
          title="Share via Email"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition shadow-md"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.713v15.426h24v-15.426l-12 9.713z"/></svg>
        </a>

        {/* X / Twitter */}
        <a 
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition shadow-md"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>

        {/* LinkedIn */}
        <a 
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition shadow-md"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>

        {/* Pinterest */}
        <a 
          href={pinterestShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Pinterest"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition shadow-md"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.331 1.363-.053.225-.172.271-.399.165-1.493-.695-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.222 7.462-1.214 0-2.355-.63-2.744-1.379l-.749 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
        </a>

        {/* Copy Link Button */}
        <button 
          onClick={handleCopy}
          title="Copy Link"
          style={{ width: '40px', height: '40px', minWidth: '40px' }}
          className={`rounded-full flex items-center justify-center transition shadow-md text-xs font-bold border border-neutral-800 ${
            copied ? 'bg-green-600 text-white border-green-600' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
          }`}
        >
          {copied ? '✓' : '🔗'}
        </button>
      </div>
    </div>
  );
}