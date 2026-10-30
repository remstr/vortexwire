'use client';

import { useEffect, useRef } from 'react';

export default function Comments() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear any existing children to prevent duplicate scripts on re-render
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', 'remstr/vortexwire');
    script.setAttribute('data-repo-id', 'R_kgDOVbRNNg');
    script.setAttribute('data-category', 'Q&A');
    script.setAttribute('data-category-id', 'DIC_kwDOVbRNNs4DJ-Ki');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', 'en');

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="mt-12 pt-8 border-t border-neutral-800" />;
}
