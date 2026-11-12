import React, { useState } from 'react';
import { Radio } from 'lucide-react';
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
        
        {/* HUD Telemetry Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/70 border border-[#06b6d4]/30 text-xs font-['Space_Mono'] text-[#06b6d4] tracking-widest uppercase">
          <Radio className="w-3.5 h-3.5 text-[#06b6d4] animate-pulse" />
          <span>GATEWAY 404 // CONVERGENCE NEXUS</span>
        </div>

        <h2 className="font-['Orbitron'] font-black text-3xl sm:text-5xl text-white tracking-wider">
          Events Portal
        </h2>
        
        <p className="max-w-md mx-auto font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#94a3b8]">
          Prepare for dimensional convergence. The multiverse competitions and registration portal will unlock soon.
        </p>

        {/* The Prominent Sheer Button (Dead-end link / placeholder) */}
        <div className="relative inline-block pt-4">
          <a
            href="#"
            onClick={handlePortalClick}
            className={`relative px-8 sm:px-14 py-5 sm:py-6 bg-black/80 text-white font-['Space_Mono'] font-bold text-base sm:text-xl tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer 
            border border-[#06b6d4]/40 hover:border-[#ec4899] hover:shadow-[0_0_30px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 sm:gap-4 mx-auto select-none animate-portal-pulse ${
              clicked ? 'border-[#ec4899] ring-2 ring-[#ec4899] shadow-[0_0_35px_#ec4899]' : ''
            }`}
            onMouseEnter={() => soundEnabled && playCyberGlitchSound()}
            title="Portal Gateway (Unlocking Soon)"
          >
            {/* Hard Corner Brackets */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#06b6d4]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ec4899]" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ec4899]" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#06b6d4]" />

            <span className="w-2.5 h-2.5 bg-[#06b6d4] inline-block shadow-[0_0_8px_#06b6d4]" />
            <span>[ BREACH PORTAL ]</span>
            <span className="w-2.5 h-2.5 bg-[#ec4899] inline-block shadow-[0_0_8px_#ec4899]" />
          </a>
        </div>

        <p className="font-['Space_Mono'] text-xs text-[#94a3b8]/70 tracking-widest uppercase pt-2">
          {clicked ? 'PORTAL INITIALIZATION QUEUED // STANDBY' : 'STATUS: PORTAL LOCKED // REGISTRATIONS COMMENCING SOON'}
        </p>

      </div>
    </section>
  );
};
