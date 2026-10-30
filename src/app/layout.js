import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SearchModal from '@/components/SearchModal';
import './globals.css';

export const metadata = {
  title: 'VortexWire | US Digital News Desk',
  description: 'Automated digital magazine covering Culture, Tech, and Automotive sectors.',
};

// Server-side function to grab all articles for instant search mapping
function getAllPostsForSearch() {
  const contentDirectory = path.join(process.cwd(), 'content');
  const categories = ['culture', 'tech', 'automotive'];
  let allPosts = [];

  categories.forEach((category) => {
    const catDir = path.join(contentDirectory, category);
    if (fs.existsSync(catDir)) {
      const filenames = fs.readdirSync(catDir);
      filenames.forEach((filename) => {
        if (filename.endsWith('.mdx')) {
          const filePath = path.join(catDir, filename);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);
          allPosts.push({
            slug: filename.replace(/\.mdx$/, '').toLowerCase(),
            category: category.toLowerCase(),
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            date: data.date || '',
          });
        }
      });
    }
  });

  return allPosts;
}

export default function RootLayout({ children }) {
  const posts = getAllPostsForSearch();

  return (
    <html lang="en" className="dark bg-black text-slate-100" style={{ colorScheme: 'dark', backgroundColor: '#000000' }}>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-black text-slate-100 min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white" style={{ backgroundColor: '#000000' }}>
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 md:py-0 md:h-20 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <Link href="/" className="text-xl md:text-3xl font-black tracking-wider text-white uppercase flex items-center gap-2 md:gap-3">
              <span className="w-3.5 h-3.5 bg-red-600 rounded-sm inline-block animate-pulse"></span>
              VORTEX<span className="text-red-600">WIRE</span>
            </Link>

            {/* Navigation Tabs & Search Trigger */}
            <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center">
              <nav className="flex items-center gap-5 md:gap-8 text-xs md:text-lg font-bold text-neutral-300 uppercase tracking-wide">
                <Link href="/culture" className="hover:text-red-500 transition">Culture</Link>
                <Link href="/tech" className="hover:text-red-500 transition">Tech & Gadgets</Link>
                <Link href="/automotive" className="hover:text-red-500 transition">Automotive</Link>
              </nav>

              {/* Instant Search Bar Trigger Component */}
              <SearchModal posts={posts} />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-6xl mx-auto px-4 w-full py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-900 bg-black py-10 text-center text-xs text-neutral-500 uppercase tracking-wider space-y-4">
          <div className="flex justify-center flex-wrap gap-6 font-bold text-neutral-400">
            <Link href="/about" className="hover:text-red-500 transition">About Us</Link>
            <Link href="/contact" className="hover:text-red-500 transition">Contact Us</Link>
            <Link href="/disclaimer" className="hover:text-red-500 transition">Privacy Policy</Link>
          </div>
          <p>© 2026 VortexWire. All rights reserved. Striking journalism for the US feed.</p>
        </footer>
      </body>
    </html>
  );
}
