'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoadMoreFeed({ subsequentPosts }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const displayedPosts = subsequentPosts.slice(0, visibleCount);
  const hasMore = visibleCount < subsequentPosts.length;

  return (
    <div className="space-y-8">
      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {displayedPosts.map((post) => (
          <Link 
            key={post.slug}
            href={`/${post.category.toLowerCase()}/${post.slug.toLowerCase()}`}
            className="group bg-neutral-950 border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-red-600/50 hover:bg-neutral-900 transition shadow-lg"
          >
            <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
              <img 
                src={post.featuredImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-red-500 border border-neutral-800 text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-bold text-red-500">
                <span className="text-neutral-500">{post.author}</span>
                <span className="group-hover:translate-x-1 transition-transform">Read Story →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-6 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold px-8 py-3 rounded-xl transition shadow-lg uppercase tracking-wider text-sm hover:border-red-600 cursor-pointer"
          >
            Load More Posts ↓
          </button>
        </div>
      )}
    </div>
  );
}
