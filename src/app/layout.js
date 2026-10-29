import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'VortexWire | US Digital News Desk',
  description: 'Automated digital magazine covering Culture, Tech, and Automotive sectors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black text-slate-100">
      <body className="bg-black min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            {/* Larger, bolder brand title */}
            <Link href="/" className="text-2xl md:text-3xl font-black tracking-wider text-white uppercase flex items-center gap-3">
              <span className="w-4 h-4 bg-red-600 rounded-sm inline-block animate-pulse"></span>
              VORTEX<span className="text-red-600">WIRE</span>
            </Link>

            {/* Navigation Tabs forced to lowercase paths */}
            <nav className="flex items-center gap-8 text-base md:text-lg font-bold text-neutral-300 uppercase tracking-wide">
              <Link href="/culture" className="hover:text-red-500 transition">Culture</Link>
              <Link href="/tech" className="hover:text-red-500 transition">Tech & Gadgets</Link>
              <Link href="/automotive" className="hover:text-red-500 transition">Automotive</Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-6xl mx-auto px-4 w-full py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-900 bg-black py-8 text-center text-xs text-neutral-500 uppercase tracking-wider">
          <p>© 2026 VortexWire. All rights reserved. Striking journalism for the US feed.</p>
        </footer>
      </body>
    </html>
  );
}