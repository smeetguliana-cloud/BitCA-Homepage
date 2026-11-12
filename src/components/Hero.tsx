import React, { useState, useEffect, useRef } from 'react';
import { playCyberGlitchSound } from '../utils/audio';
import GlitchCharReveal from './GlitchCharReveal';
import GlitchEffect from './GlitchEffect';

interface HeroProps {
  soundEnabled: boolean;
}

export const Hero: React.FC<HeroProps> = ({ soundEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodic auto-scramble trigger roughly every 7.5 seconds
  const [scrambleKey, setScrambleKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrambleKey((prev) => prev + 1);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-20 pb-12 overflow-hidden"
    >
      {/* 0. FIXED STARFIELD BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.8), rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.6
        }} 
      />

      {/* Tactical HUD Telemetry Borders & Coordinates (Matching Mockup) */}
      <div className="hidden lg:block absolute top-24 left-8 pointer-events-none select-none font-['Space_Mono'] text-[10px] tracking-widest text-[#94a3b8]/50 uppercase">
        <div>Digital Telemetry</div>
        <div className="text-[9px] text-[#94a3b8]/30 tracking-[0.25em] mt-0.5">:::</div>
        <div className="text-[9px] text-[#94a3b8]/40">★</div>
      </div>

      <div className="hidden lg:block absolute top-24 right-8 pointer-events-none select-none font-['Space_Mono'] text-[10px] tracking-widest text-[#94a3b8]/50 uppercase text-right">
        <div>Coordinates</div>
        <div className="text-[9px] text-[#94a3b8]/30 tracking-[0.25em] mt-0.5">| | |</div>
        <div className="text-[9px] text-[#94a3b8]/40">★</div>
      </div>

      <div className="hidden lg:block absolute bottom-6 left-8 pointer-events-none select-none font-['Space_Mono'] text-[10px] tracking-widest text-[#94a3b8]/50 uppercase">
        Coordinates: -109
      </div>

      <div className="hidden lg:block absolute bottom-6 right-8 pointer-events-none select-none font-['Space_Mono'] text-[10px] tracking-widest text-[#94a3b8]/50 uppercase text-right">
        Coordinates: 8.8
      </div>

      <div className="hidden xl:block absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none select-none font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#94a3b8]/30 uppercase">
        TELEMETRY
      </div>

      <div className="hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 rotate-90 origin-center pointer-events-none select-none font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#94a3b8]/30 uppercase">
        TELEMETRY
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        
        {/* 1. PRIMARY FEST HEADLINE: Ultra-Wide 3D Chrome with Syncopate */}
        <h1 className="flex items-center justify-center whitespace-nowrap font-black tracking-tighter leading-none font-['Syncopate'] uppercase select-none mb-4 sm:mb-6 w-full">
          <img 
            src="/image_c80197.jpg" 
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('images/Visionexa.png')) {
                target.src = '/images/Visionexa.png';
              }
            }}
            alt="V" 
            className="h-[clamp(2.5rem,8vw,6.5rem)] w-auto object-contain mr-1 sm:mr-3 shrink-0"
            style={{ mixBlendMode: 'screen' }}
          />
          <span 
            className="text-[clamp(2rem,7vw,5.5rem)]"
            style={{
              /* Bright luminous silver face with a sharp center bevel cut */
              background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 42%, #475569 50%, #94a3b8 55%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              /* Shiny edge highlight to catch the light */
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)',
              /* Solid, metallic 3D block extrusion */
              textShadow: '0px 1px 0px #94a3b8, 0px 2px 0px #64748b, 0px 3px 0px #475569, 0px 4px 0px #334155, 0px 5px 0px #1e293b, 0px 6px 0px #0f172a, 0px 7px 0px #020617, 0px 20px 30px rgba(0,0,0,0.9)'
            }}
          >
            ISIONEXA '26
          </span>
        </h1>

        {/* 2. FROSTED OBSIDIAN THEME CARD */}
        <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#050508]/82 backdrop-blur-xl p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.95)] mb-6 sm:mb-7 text-left">
          
          {/* Title & Subtitle Stack */}
          <div className="flex flex-col items-start gap-1.5 pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 font-['Syne'] font-extrabold text-xl sm:text-3xl tracking-tight leading-none">
              <span className="text-[#f8fafc]">MULTIVERSE</span>
              <span className="text-[#3b82f6] inline-flex items-center">
                <GlitchEffect 
                  key={scrambleKey}
                  text="404"
                  color="#3b82f6"
                  playMode="enter"
                  infinite={false}
                  repeat={1}
                  font={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(1.35rem, 3.2vw, 1.9rem)",
                    fontWeight: 800,
                  }}
                  shake={{
                    enabled: true,
                    x: 4,
                    y: 4,
                  }}
                  slice={{
                    minHeight: 15,
                    maxHeight: 35,
                    intensity: 70,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </div>

            <div className="font-['Space_Mono'] text-xs sm:text-sm tracking-[0.22em] text-[#10b981] font-bold uppercase">
              <span>REALITY NOT FOUND</span>
              <span className="blinking-cursor ml-1">_</span>
            </div>
          </div>

          {/* Philosophical Tagline */}
          <div className="pt-3.5 overflow-x-hidden">
            <GlitchCharReveal 
              key={scrambleKey}
              words="what if reality was never real?"
              color="#94a3b8"
              tag="p"
              enterAnimation={{
                mode: "oneLine",
                duration: 1.6,
                ease: "easeOut",
                scrambleIntensity: 80,
                replay: true,
                restState: "solid",
                position: "above",
                flickerEnabled: false,
              }}
              hoverAnimation={{
                type: "diffusion",
                lines: "oneLine",
                radius: 2,
                collapse: true,
                collapseTime: 0.8,
                glitchChars: "!/{}0101_#$<",
                glitchShuffle: true,
                flickerEnabled: false,
              }}
              font={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "clamp(0.75rem, 2.8vw, 0.9rem)",
                letterSpacing: "0.03em",
                lineHeight: "1.4",
                textAlign: "left",
                fontStyle: "italic",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            />
          </div>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md">
          <a 
            href="#portal" 
            className="w-full sm:w-auto px-8 py-3.5 text-center text-xs sm:text-sm font-['Space_Mono'] font-bold tracking-[0.2em] uppercase bg-[#f8fafc] hover:bg-white text-[#050508] rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-flex items-center justify-center gap-2"
            onMouseEnter={() => soundEnabled && playCyberGlitchSound()}
          >
            <span>ENTER PORTAL</span>
            <span>→</span>
          </a>
          <a 
            href="#about" 
            className="w-full sm:w-auto px-8 py-3.5 text-center text-xs sm:text-sm font-['Space_Mono'] font-bold tracking-[0.2em] uppercase bg-[#050508]/80 hover:bg-white/[0.08] backdrop-blur-md border border-white/20 text-[#f8fafc] rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            <span>EXPLORE</span>
            <span>↓</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
