import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const contentDirectory = path.join(process.cwd(), 'content');

export function generateStaticParams() {
  return [
    { category: 'culture' },
    { category: 'tech' },
    { category: 'automotive' },
  ];
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category?.toLowerCase();

  const catDir = path.join(contentDirectory, category);

  if (!fs.existsSync(catDir)) {
    notFound();
  }

  const filenames = fs.readdirSync(catDir);
  const posts = filenames
    .filter((fn) => fn.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(catDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.mdx$/, '').toLowerCase(),
        birthtime: stats.birthtimeMs || stats.mtimeMs,
        ...data,
        category: category,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-neutral-800 pb-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-red-500">{categoryTitle}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1 rounded-md font-bold">
              {posts.length} Dispatches Active
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            {categoryTitle} Wire
          </h1>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
          No articles found in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.slug}
              href={`/${category}/${post.slug}`}
              className="group bg-neutral-950 border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-red-600/50 hover:bg-neutral-900 transition shadow-lg"
            >
              <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                <img 
                  src={post.featuredImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-red-500 border border-neutral-800 text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                  {category}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-2">
                  <span className="text-xs text-neutral-500">{post.date}</span>
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
      )}
    </div>
  );
}
