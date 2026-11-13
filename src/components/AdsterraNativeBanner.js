'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraNativeBanner() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent duplicate script injection on re-renders
    if (container.querySelector('script')) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bicea.org/21/d21bd12bf455aa5ce3bccc5a633f3b62';

    container.appendChild(script);
  }, []);

  return (
    <div className="my-10 pt-8 border-t border-neutral-900">
      <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-4 font-semibold">
        Sponsored Stories
      </p>
      <div ref={containerRef}>
        <div id="container-d21bd12bf455aa5ce3bccc5a633f3b62" />
      </div>
    </div>
  );
}
