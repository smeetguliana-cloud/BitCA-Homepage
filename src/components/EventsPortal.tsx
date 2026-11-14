import React, { useState } from 'react';
import { playCyberGlitchSound } from '../utils/audio';

interface EventsPortalProps {
  soundEnabled: boolean;
}

export const EventsPortal: React.FC<EventsPortalProps> = ({ soundEnabled }) => {
  const [clicked, setClicked] = useState(false);

  const handlePortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soundEnabled) {
      playCyberGlitchSound();
    }
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <section
      id="portal"
      className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 relative overflow-hidden"
    >
      <div id="events-trigger" className="absolute -top-24" />
      <div className="max-w-4xl mx-auto text-center space-y-6">

        <h2 className="font-['Orbitron'] font-black text-3xl sm:text-5xl text-[#F2F7FF] tracking-wider">
          Events Portal
        </h2>
        
        <p className="max-w-md mx-auto font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#94a3b8]">
          Prepare for dimensional convergence. The multiverse competitions and registration portal will unlock soon.
        </p>

        {/* The Prominent Sheer Button with Electric Cyan -> Violet -> Magenta Gradient Border */}
        <div className="relative inline-block pt-4">
          <div className={`relative p-[1.5px] bg-gradient-to-r from-[#00D9FF] via-[#A855F7] to-[#EC4899] transition-all duration-300 hover:scale-105 active:scale-95 animate-portal-pulse ${
            clicked ? 'ring-2 ring-[#EC4899] shadow-[0_0_35px_rgba(236,72,153,0.65)]' : ''
          }`}>
            <a
              href="#"
              onClick={handlePortalClick}
              className="relative px-8 sm:px-14 py-5 sm:py-6 bg-[#050508]/90 backdrop-blur-xl text-[#F2F7FF] font-['Space_Mono'] font-bold text-base sm:text-xl tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center gap-3 sm:gap-4 mx-auto select-none hover:shadow-[inset_0_0_20px_rgba(0,217,255,0.22)]"
              onMouseEnter={() => soundEnabled && playCyberGlitchSound()}
              title="Portal Gateway (Unlocking Soon)"
            >
              {/* Hard Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00D9FF]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#EC4899]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#EC4899]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00D9FF]" />

              <span className="w-2.5 h-2.5 bg-[#00D9FF] inline-block shadow-[0_0_8px_#00D9FF]" />
              <span>[ BREACH PORTAL ]</span>
              <span className="w-2.5 h-2.5 bg-[#EC4899] inline-block shadow-[0_0_8px_#EC4899]" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
