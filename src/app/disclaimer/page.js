import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Disclaimer — VortexWire',
  description: 'Legal disclaimers, cookie policies, and privacy terms for VortexWire.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 text-neutral-300">
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest">Legal & Compliance</span>
        <h1 className="text-3xl md:text-4xl font-black text-white">Privacy Policy & Disclaimer</h1>
        <p className="text-neutral-400 text-sm">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 leading-relaxed text-sm md:text-base">
        <h2 className="text-2xl font-bold text-white pt-2">1. Advertisements & Google AdSense</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on VortexWire. Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
        </p>
        <p>
          Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-red-500 underline">Google Ads Settings</a>.
        </p>

        <h2 className="text-2xl font-bold text-white pt-2">2. Analytics & Tracking</h2>
        <p>
          VortexWire uses privacy-friendly analytics tools (such as Umami) to monitor traffic metrics and performance. These tools do not track personal user data, store invasive tracking cookies, or compromise visitor anonymity.
        </p>

        <h2 className="text-2xl font-bold text-white pt-2">3. Content Curation & Accuracy Disclaimer</h2>
        <p>
          VortexWire is a digital news aggregator and curation platform. Articles, briefs, and updates compiled on this site are gathered from public RSS feeds, automated wires, and open sources. While we strive to maintain accuracy and integrity, VortexWire makes no warranties regarding the absolute completeness or reliability of automated feeds.
        </p>

        <h2 className="text-2xl font-bold text-white pt-2">4. External Links</h2>
        <p>
          Our articles contain outbound links to external third-party websites. VortexWire has no control over the content, privacy practices, or security of external sites and assumes no liability for them.
        </p>

        <div className="pt-6 border-t border-neutral-800">
          <Link href="/" className="text-red-500 font-bold hover:underline text-sm">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
