'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchModal({ posts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Keyboard shortcut (Ctrl+K or Cmd+K) to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPosts = query.trim() === '' ? [] : posts.filter((post) => 
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
    post.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Search Trigger Button in Nav */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-lg text-xs transition"
      >
        <span>Search dispatches...</span>
        <kbd className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Search Input Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
              <span className="text-red-500 font-bold">🔍</span>
              <input
                autoFocus
                type="text"
                placeholder="Type keywords, categories, or titles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-neutral-500 text-base focus:outline-none"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-neutral-400 hover:text-white bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800"
              >
                ESC
              </button>
            </div>

            {/* Search Results Area */}
            <div className="overflow-y-auto p-4 space-y-2 flex-grow">
              {query.trim() !== '' && filteredPosts.length === 0 && (
                <div className="text-center py-10 text-neutral-500 text-sm">
                  No dispatches found matching &quot;{query}&quot;.
                </div>
              )}

              {query.trim() === '' && (
                <div className="text-center py-10 text-neutral-600 text-xs uppercase tracking-widest">
                  Start typing to search the VortexWire database
                </div>
              )}

              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.category}/${post.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/60 hover:border-red-600/50 p-3.5 rounded-xl transition group"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                    <span className="text-red-500 uppercase font-bold tracking-wider">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-neutral-900/50 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between items-center">
              <span>VortexWire Intelligence Desk</span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
