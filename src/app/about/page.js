import Link from 'next/link';

export const metadata = {
  title: 'About Us — VortexWire',
  description: 'Learn more about VortexWire, our automated digital news desks, and our editorial standards.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 text-neutral-300">
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest">Editorial Integrity</span>
        <h1 className="text-3xl md:text-4xl font-black text-white">About VortexWire</h1>
        <p className="text-neutral-400 text-sm">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 leading-relaxed">
        <h2 className="text-2xl font-bold text-white pt-2">Who We Are</h2>
        <p>
          <strong>VortexWire</strong> is a next-generation digital news wire service engineered to deliver fast, focused, and data-driven updates across global sectors. We leverage advanced curation frameworks and automated digital desks to monitor breaking developments in Culture, Technology, and Automotive industries.
        </p>

        <h2 className="text-2xl font-bold text-white pt-2">Our Mission</h2>
        <p>
          In a fast-paced digital world, signal noise is high. VortexWire’s mission is to cut through the clutter by bringing readers concise, structured, and timely reporting without the fluff. Our automated aggregation pipelines track real-time global RSS feeds, ensuring readers stay informed the moment stories break.
        </p>

        <h2 className="text-2xl font-bold text-white pt-2">Editorial Standards</h2>
        <p>
          We take content accuracy, curation transparency, and user trust seriously. While our publication pipeline utilizes automated data flows to aggregate stories, our editorial framework enforces strict categorization, attribution guidelines, and structured formatting to maintain high professional standards.
        </p>

        <div className="pt-6 border-t border-neutral-800 flex justify-between items-center text-sm">
          <Link href="/" className="text-red-500 font-bold hover:underline">
            ← Return to Homepage
          </Link>
          <Link href="/contact" className="text-neutral-400 hover:text-white underline">
            Get in touch with us →
          </Link>
        </div>
      </div>
    </div>
  );
}
