'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraHomeBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Prevent duplicate script injection on re-renders
    if (container.querySelector('script')) return;

    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : 'af6de142a46dccf0370fad357a19e96e',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://bicea.org/22/af6de142a46dccf0370fad357a19e96e';

    container.appendChild(configScript);
    container.appendChild(invokeScript);
  }, []);

  return (
    <div className="my-6 flex flex-col items-center justify-center">
      <div
        ref={bannerRef}
        className="min-h-[50px] min-w-[320px] flex items-center justify-center bg-neutral-950/60 border border-neutral-900 rounded-md overflow-hidden"
      />
    </div>
  );
}
