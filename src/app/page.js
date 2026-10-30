import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

function getAllPosts() {
  const categories = ['culture', 'tech', 'automotive'];
  let allPosts = [];

  categories.forEach((category) => {
    const catDir = path.join(process.cwd(), 'content', category);
    if (fs.existsSync(catDir)) {
      const filenames = fs.readdirSync(catDir);
      filenames.forEach((filename) => {
        if (filename.endsWith('.mdx')) {
          const filePath = path.join(catDir, filename);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const stats = fs.statSync(filePath); // Get file creation/modification stats
          const { data } = matter(fileContents);
          
          allPosts.push({
            slug: filename.replace(/\.mdx$/, '').toLowerCase(),
            category: category.toLowerCase(),
            birthtime: stats.birthtimeMs || stats.mtimeMs, // Track exact file timestamp
            ...data,
          });
        }
      });
    }
  });

  // Sort primarily by date descending, and fallback to exact file creation time if dates match
  return allPosts.sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;
    return b.birthtime - a.birthtime;
  });
}

export default function Home() {
  const posts = getAllPosts();
  const leadPost = posts.length > 0 ? posts[0] : null;
  const secondaryPosts = posts.slice(1, 7);

  return (
    <div className="space-y-12 pb-12">
      {/* HERO LEAD STORY */}
      {leadPost ? (
        <section className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl group">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <div className="relative h-96 md:h-[480px] w-full">
            <img 
              src={leadPost.featuredImage} 
              alt={leadPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-10 space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-red-600 text-white font-bold px-3 py-1 rounded uppercase tracking-wider">
                Breaking {leadPost.category}
              </span>
              <span className="text-neutral-300">{leadPost.date}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300">By {leadPost.author}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">
              <Link href={`/${leadPost.category.toLowerCase()}/${leadPost.slug.toLowerCase()}`} className="hover:text-red-500 transition">
                {leadPost.title}
              </Link>
            </h1>

            <p className="text-neutral-300 text-sm md:text-base line-clamp-2 max-w-2xl">
              {leadPost.excerpt}
            </p>

            <div className="pt-2">
              <Link 
                href={`/${leadPost.category.toLowerCase()}/${leadPost.slug.toLowerCase()}`}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded transition shadow-lg uppercase tracking-wider"
              >
                Read Featured Story →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
          No articles published yet. Run your Python publisher script to populate VortexWire!
        </div>
      )}

      {/* LATEST WIRE FEED */}
      {secondaryPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              Latest Wire Feeds
            </h2>
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Culture • Tech • Automotive</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryPosts.map((post) => (
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
        </section>
      )}
    </div>
  );
}
