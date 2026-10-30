import Link from 'next/link';

export const metadata = {
  title: 'Contact Us — VortexWire',
  description: 'Get in touch with the VortexWire editorial and support desk.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 text-neutral-300">
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest">Support & Inquiries</span>
        <h1 className="text-3xl md:text-4xl font-black text-white">Contact Us</h1>
        <p className="text-neutral-400 text-sm">We’d love to hear from our readers, partners, or media syndicates.</p>
      </div>

      <div className="space-y-6 leading-relaxed">
        <p>
          Whether you have a news tip, feedback on our coverage, a copyright inquiry, or advertising questions regarding VortexWire, our desk is open.
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Direct Editorial Desk</h3>
          <p className="text-sm text-neutral-400">
            You can reach our administrative and editorial publishing team directly via email:
          </p>
          <div className="pt-2">
            <a 
              href="mailto:editorial@vortexwire.fyi" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg text-sm"
            >
              editorial@vortexwire.fyi
            </a>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-2">Response Times</h2>
        <p>
          Our automated systems run 24/7, but human inquiries sent to our inbox are typically reviewed and answered within 24 to 48 business hours.
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
