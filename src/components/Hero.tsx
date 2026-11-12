import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
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
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center px-5 sm:px-10 lg:px-16 pt-20 pb-12 overflow-hidden selection:bg-[#ec4899]/30"
    >
      {/* 
        Offset from dead center to leave room for a central 3D background element.
        Container aligned to the left/mid-left with hard corner tactical HUD brackets.
      */}
      <div className="max-w-3xl space-y-6 sm:space-y-8 z-10">
        
        {/* Main Content Cluster */}
        <div className="space-y-5 sm:space-y-6">
          
          {/* Institutional Eyebrow with Logo V and Liquid Metal Gradient */}
          <div className="flex items-center justify-start text-xs sm:text-sm md:text-base tracking-[0.3em] font-['Orbitron'] font-semibold mb-2 sm:mb-3">
            <img
              src="/image_c80197.jpg"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('Visionexa.jpeg')) {
                  target.src = '/Visionexa.jpeg';
                }
              }}
              alt="V"
              className="h-4 sm:h-6 md:h-7 w-auto object-contain mix-blend-screen -mt-0.5 mr-1"
            />
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 30%, #94a3b8 55%, #ffffff 85%, #64748b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.35))',
              }}
            >
              ISIONEXA '26
            </span>
          </div>

          {/* Main Title: Solid MULTIVERSE + Periodic GlitchEffect 404 */}
          <h1 className="font-black tracking-tight leading-[0.88] font-['Orbitron'] select-none">
            <span className="text-[#f8fafc] block text-[10.5vw] sm:text-6xl md:text-7xl lg:text-[7.2rem]">
              MULTIVERSE
            </span>
            <span className="text-[#06b6d4] block -mt-1 sm:-mt-2 flex items-center">
              <GlitchEffect
                key={scrambleKey}
                text="404"
                color="#06b6d4"
                playMode="enter"
                infinite={false}
                repeat={1}
                font={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(3.5rem, 10.5vw, 7.2rem)",
                  fontWeight: 900,
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
          </h1>

          {/* Text Contrast Shield Layer */}
          <div className="relative inline-flex flex-col gap-2 py-1">
            {/* Dark Radial Mask (knocks out the bright singularity core behind the text) */}
            <div 
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-6 bg-radial from-black via-black/85 to-transparent blur-xl pointer-events-none -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 45%, transparent 75%)',
              }}
            />

            {/* Subtitle: "REALITY NOT FOUND" with deep text shadow */}
            <div className="relative inline-flex items-baseline font-['Space_Mono'] text-xs sm:text-sm md:text-base tracking-[0.25em] text-[#06b6d4] font-bold [text-shadow:_0_0_15px_rgba(6,182,212,0.8),_0_2px_10px_#000000,_0_0_20px_#000000]">
              <span className="animate-severe-flicker">REALITY NOT FOUND</span>
              <span className="blinking-cursor ml-1.5">_</span>
            </div>

            {/* Scramble Tagline */}
            <div className="w-full max-w-xl overflow-x-hidden [text-shadow:_0_2px_8px_#000000,_0_0_16px_#000000]">
              <GlitchCharReveal
                key={scrambleKey}
                words="what if reality was never real?"
                tag="p"
                color="#94a3b8"
                lines="oneLine"
                glitchChars="!/{}0101_#$<>"
                enterAnimation={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 1.6,
                  collapse: true,
                  collapseTime: 0.8,
                  replay: true,
                }}
                hoverAnimation={{
                  type: "diffusion",
                  mode: "solid",
                  radius: 12,
                  scrambleIntensity: 85,
                  glitchShuffle: true,
                  flickerEnabled: false,
                }}
                flickerEnabled={false}
                replay={true}
                font={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "clamp(0.7rem, 2.8vw, 0.95rem)",
                  letterSpacing: "clamp(0.01em, 0.3vw, 0.05em)",
                  lineHeight: "1.3",
                  textAlign: "left",
                  fontStyle: "italic",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              />
            </div>
          </div>

          {/* Action Buttons: 2-column on mobile, inline-flex on sm+ */}
          <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-4 w-full max-w-md">
            <a
              href="#events-trigger"
              className="px-4 sm:px-8 py-3 sm:py-3.5 font-['Space_Mono'] text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#07070d] bg-[#06b6d4] hover:bg-[#ec4899] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-200 text-center flex items-center justify-center whitespace-nowrap"
              onMouseEnter={() => soundEnabled && playCyberGlitchSound()}
            >
              [ BREACH PORTAL ]
            </a>
            <a
              href="#about"
              className="px-3 sm:px-6 py-3 sm:py-3.5 font-['Space_Mono'] text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-white bg-black/70 hover:bg-[#06b6d4]/10 border border-[#06b6d4]/30 hover:border-[#06b6d4] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 group text-center whitespace-nowrap"
            >
              <span>ABOUT BITCA</span>
              <ArrowDown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#06b6d4] group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Coordinates Meta with generous top buffer */}
          <div className="mt-6 sm:mt-10 flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-['Space_Mono'] text-[#94a3b8]/70">
            <span>GRID: 18.9287° N, 72.8258° E</span>
            <span>·</span>
            <span>KC_COLLEGE // HSNCU</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
