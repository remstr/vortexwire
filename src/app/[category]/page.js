import { getPostsByCategory } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

const VALID_CATEGORIES = ["culture", "tech", "automotive"];

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category;

  if (!category || !VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const posts = getPostsByCategory(category);
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Category Header */}
      <div className="border-b border-neutral-900 pb-6">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest">VortexWire Feed</span>
        <h1 className="text-3xl md:text-4xl font-black text-white mt-1 capitalize">{categoryTitle}</h1>
        <p className="text-neutral-400 text-sm mt-2">Latest curated updates and automated digital briefs for the US {category} sector.</p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400">
          No articles found yet. Run your Python publisher script to generate some!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/${category.toLowerCase()}/${post.slug}`}
              className="group bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-5 items-center hover:border-red-600/50 hover:bg-neutral-900 transition shadow-lg"
            >
              {/* Thumbnail (Left side) */}
              <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                <img 
                  src={post.featuredImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content & Metadata (Right side) */}
              <div className="flex flex-col justify-between flex-grow w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="bg-red-600/10 text-red-500 font-extrabold px-2.5 py-0.5 rounded border border-red-600/20 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                </div>

                <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-red-500 transition leading-snug">
                  {post.title}
                </h2>

                <p className="text-neutral-400 text-sm line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="pt-1 flex items-center justify-end text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform">
                  Read Brief →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}