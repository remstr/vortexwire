import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import ShareButtons from '@/components/ShareButtons';
import Comments from '@/components/Comments';

const contentDirectory = function() {
  return path.join(process.cwd(), 'content');
};

export async function generateStaticParams() {
  const categories = ['culture', 'tech', 'automotive'];
  let paths = [];

  categories.forEach((category) => {
    const catDir = path.join(contentDirectory(), category);
    if (fs.existsSync(catDir)) {
      const filenames = fs.readdirSync(catDir);
      filenames.forEach((filename) => {
        if (filename.endsWith('.mdx')) {
          paths.push({
            category: category.toLowerCase(),
            slug: filename.replace(/\.mdx$/, '').toLowerCase(),
          });
        }
      });
    }
  });

  if (paths.length === 0) {
    paths.push({ category: 'culture', slug: 'placeholder' });
  }

  return paths;
}

// Dynamic Open Graph & Twitter metadata generation for social sharing
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category?.toLowerCase();
  const slug = resolvedParams?.slug?.toLowerCase();
  
  const filePath = path.join(contentDirectory(), category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return { title: 'Not Found — VortexWire' };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    title: `${data.title} — VortexWire`,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      url: `https://www.vortexwire.fyi/${category}/${slug}`,
      siteName: 'VortexWire',
      images: [
        {
          url: data.featuredImage || 'https://www.vortexwire.fyi/default-og.jpg',
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt,
      images: [data.featuredImage],
    },
  };
}

// Helper to get up to 3 related articles from the same category
function getRelatedPosts(currentCategory, currentSlug) {
  const catDir = path.join(contentDirectory(), currentCategory);
  if (!fs.existsSync(catDir)) return [];

  const filenames = fs.readdirSync(catDir);
  const posts = filenames
    .filter((fn) => fn.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(catDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug: filename.replace(/\.mdx$/, '').toLowerCase(),
        category: currentCategory,
        ...data,
      };
    })
    .filter((p) => p.slug !== currentSlug);

  return posts.slice(0, 3);
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category?.toLowerCase();
  const slug = resolvedParams?.slug?.toLowerCase();
  
  const filePath = path.join(contentDirectory(), category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Calculate reading time (avg 200 words per minute)
  const wordCount = content.split(/\s+/g).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Fetch related posts for the bottom section
  const relatedPosts = getRelatedPosts(category, slug);

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6 px-4">
      {/* Back button */}
      <div>
        <Link href={`/${category}`} className="text-sm text-red-500 hover:text-red-400 font-bold inline-flex items-center gap-1">
          ← Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4 border-b border-neutral-900 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="bg-red-600/10 text-red-500 font-bold px-3 py-1 rounded border border-red-600/20 uppercase tracking-wider">
              {data.category}
            </span>
            <span>{data.date}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
            <span>•</span>
            <span>By {data.author}</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
          {data.title}
        </h1>

        <p className="text-neutral-300 text-lg">
          {data.excerpt}
        </p>

        {/* SOCIAL SHARE BUTTONS */}
        <div className="pt-2">
          <ShareButtons title={data.title} slug={slug} category={category} />
        </div>
      </div>

      {/* Featured Image Banner */}
      {data.featuredImage && (
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-xl">
          <img 
            src={data.featuredImage} 
            alt={data.imageAlt || data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content Rendered with ReactMarkdown */}
      <div className="text-neutral-300 space-y-6 leading-relaxed text-base md:text-lg">
        <ReactMarkdown
          components={{
            h2: ({node, ...props}) => <h2 className="text-2xl font-black text-white pt-4 pb-2" {...props} />,
            p: ({node, ...props}) => <p className="text-neutral-300 mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-4 text-neutral-300" {...props} />,
            li: ({node, ...props}) => <li className="text-neutral-300" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* RELATED STORIES SECTION */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-neutral-900">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Related in {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((post) => (
              <Link 
                key={post.slug}
                href={`/${post.category}/${post.slug}`}
                className="group bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-red-600/50 transition shadow-lg"
              >
                <div className="space-y-2">
                  <span className="text-[10px] text-neutral-500">{post.date}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-red-500 transition line-clamp-2">
                    {post.title}
                  </h4>
                </div>
                <span className="text-xs font-bold text-red-500 pt-4">Read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* COMMENT SECTION */}
      <Comments />

      {/* Footer Return */}
      <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-sm text-neutral-500">
        <span>Published on VortexWire Digital Desk</span>
        <Link href="/" className="text-red-500 hover:underline">
          Return Home
        </Link>
      </div>
    </article>
  );
}
