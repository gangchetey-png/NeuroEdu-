import React, { useEffect, useRef } from 'react';

export const VLibrasWidget: React.FC = React.memo(() => {
  const initialized = useRef(false);

  useEffect(() => {
    const scriptId = 'vlibras-script';
    const scriptSrc = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    
    const initWidget = () => {
      // @ts-ignore
      if (window.VLibras && !initialized.current) {
        try {
          // @ts-ignore
          new window.VLibras.Widget('https://vlibras.gov.br/app');
          initialized.current = true;
        } catch (e) {
          console.error("VLibras initialization failed:", e);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
          setTimeout(initWidget, 1000);
      };
      document.body.appendChild(script);
    } else {
        setTimeout(initWidget, 1000);
    }
  }, []);

  return (
    <>
      {/* Estilos globais forçados para garantir que o widget carregue mas o botão padrão fique invisível */}
      <style>{`
        [vw-access-button] {
            opacity: 0 !important;
            pointer-events: none !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            position: fixed !important;
            bottom: 0 !important;
            right: 0 !important;
            z-index: -1 !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <div vw="true" className="enabled">
        {/* @ts-ignore */}
        <div vw-access-button="true" className="active"></div>
        {/* @ts-ignore */}
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </>
  );
});