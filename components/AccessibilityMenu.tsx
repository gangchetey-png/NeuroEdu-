
import React, { useState } from 'react';
import { Accessibility, Type, Eye, Volume2, X, Languages, Check, ZapOff, Palette } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilityMenuProps {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ settings, updateSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLibrasActive, setIsLibrasActive] = useState(false);

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        const text = document.body.innerText;
        const utterance = new SpeechSynthesisUtterance(text.substring(0, 500));
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Seu navegador não suporta leitura de texto.");
    }
  };

  const toggleLibras = () => {
      // O Widget VLibras geralmente injeta um elemento com o atributo vw-access-button
      const widget = document.querySelector('[vw-access-button]');
      
      if (widget) {
        const widgetEl = widget as HTMLElement;
        
        // Salva o estado original do pointer-events
        const originalPointerEvents = widgetEl.style.pointerEvents;
        
        // Força pointer-events para garantir que o clique seja registrado
        // (pois o widget pode estar oculto com pointer-events: none no CSS global)
        widgetEl.style.pointerEvents = 'auto';
        
        // Simula o clique para ativar/abrir o avatar do VLibras
        widgetEl.click();
        
        // Atualiza o estado local para feedback visual no botão
        setIsLibrasActive(!isLibrasActive);
        
        // Fecha o menu de acessibilidade para melhor UX
        setIsOpen(false);

        // Restaura o pointer-events após um breve delay para garantir que o evento de clique propagou
        setTimeout(() => {
            // Se quisermos manter o botão oculto mas o avatar visível, restauramos.
            // O avatar vive em outro container ([vw-plugin-wrapper]), então isso não afeta o avatar.
            widgetEl.style.pointerEvents = originalPointerEvents;
        }, 500);

      } else {
        console.warn("Widget VLibras não encontrado no DOM.");
        alert("O tradutor de Libras está inicializando. Tente novamente em alguns segundos.");
      }
  };

  return (
    <div className="fixed right-4 bottom-4 z-[99999] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-4 border border-gray-200 dark:border-gray-700 w-80 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
              <Accessibility className="w-6 h-6 text-primary-600" /> Acessibilidade
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Font Size */}
            <div>
              <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2 mb-2">
                <Type className="w-4 h-4" /> Tamanho da Fonte
              </label>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button 
                  onClick={() => updateSettings({ fontSize: 1 })}
                  className={`flex-1 py-2 rounded-md font-bold transition-all ${settings.fontSize === 1 ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >A</button>
                <button 
                  onClick={() => updateSettings({ fontSize: 1.2 })}
                  className={`flex-1 py-2 text-lg rounded-md font-bold transition-all ${settings.fontSize === 1.2 ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >A+</button>
                <button 
                  onClick={() => updateSettings({ fontSize: 1.4 })}
                  className={`flex-1 py-2 text-xl rounded-md font-bold transition-all ${settings.fontSize === 1.4 ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >A++</button>
              </div>
            </div>

            {/* Cognitive & Sensory Toggles */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Alto Contraste
                  </label>
                  <button 
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.highContrast ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${settings.highContrast ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <ZapOff className="w-4 h-4" /> Reduzir Movimento
                  </label>
                  <button 
                    onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.reduceMotion ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${settings.reduceMotion ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Cores Suaves
                  </label>
                  <button 
                    onClick={() => updateSettings({ calmPalette: !settings.calmPalette })}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.calmPalette ? 'bg-stone-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${settings.calmPalette ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="font-serif italic font-bold">D</span> Fonte Dislexia
                  </label>
                  <button 
                    onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${settings.dyslexicFont ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${settings.dyslexicFont ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Actions */}
            <div className="space-y-3">
                 <button 
                  onClick={toggleLibras}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md ${isLibrasActive ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-100'}`}
                >
                  <Languages className="w-5 h-5" /> 
                  {isLibrasActive ? 'Ocultar Libras' : 'Tradutor de Libras'}
                </button>

                 <button 
                  onClick={toggleSpeech}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <Volume2 className="w-5 h-5" /> Ler Conteúdo da Página
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300 border-4 border-white dark:border-gray-800"
        aria-label="Menu de Acessibilidade"
      >
        <Accessibility className="w-8 h-8" />
      </button>
    </div>
  );
};
