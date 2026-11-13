'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraArticleBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Prevent duplicate injection on re-renders
    if (container.querySelector('script')) return;

    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : '3c2fb0ba1502d6f4434ff9222e48ddb3',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://bicea.org/22/3c2fb0ba1502d6f4434ff9222e48ddb3';

    container.appendChild(configScript);
    container.appendChild(invokeScript);
  }, []);

  return (
    <div className="my-6 flex flex-col items-center justify-center">
      <span className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
        Advertisement
      </span>
      <div
        ref={bannerRef}
        className="min-h-[250px] min-w-[300px] flex items-center justify-center bg-neutral-950/60 border border-neutral-900 rounded-lg overflow-hidden"
      />
    </div>
  );
}
