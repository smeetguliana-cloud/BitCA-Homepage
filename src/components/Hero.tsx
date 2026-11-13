import React, { useRef, useState } from 'react';
import { playCyberGlitchSound } from '../utils/audio';
import { RefractedText } from './refracted-text';
import { GlitchEffect } from './GlitchEffect';
import { GlitchCharReveal } from './GlitchCharReveal';

interface HeroProps {
  soundEnabled: boolean;
}

export const Hero: React.FC<HeroProps> = ({ soundEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glitchTick, setGlitchTick] = useState(0);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 pt-20 pb-10 sm:pt-32 sm:pb-12 overflow-hidden"
    >
      {/* Organic Multi-Layer Starfield */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 42px 68px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 154px 210px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1.5px 1.5px at 265px 95px, rgba(186,230,253,0.85), transparent),
            radial-gradient(1px 1px at 88px 280px, rgba(255,255,255,0.6), transparent)
          `,
          backgroundSize: '317px 317px',
          opacity: 0.75,
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 110px 140px, rgba(255,255,255,0.85), transparent),
            radial-gradient(1px 1px at 390px 75px, rgba(255,255,255,0.65), transparent),
            radial-gradient(1.5px 1.5px at 240px 430px, rgba(125,211,252,0.8), transparent),
            radial-gradient(1px 1px at 470px 310px, rgba(255,255,255,0.55), transparent)
          `,
          backgroundSize: '523px 523px',
          opacity: 0.65,
        }}
      />

      {/* CENTER HERO STACK */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto text-center py-6">

        {/* 1. PRIMARY FEST HEADLINE: Refracted Chrome VISIONEXA'26 */}
        <h1
          className="flex items-center justify-center whitespace-nowrap select-none w-full max-w-full overflow-visible mb-8 sm:mb-9 relative z-10"
          style={{
            filter:
              'drop-shadow(0 0 12px rgba(0, 217, 255, 0.22)) drop-shadow(0 8px 22px rgba(0, 0, 0, 0.96))',
          }}
        >
          <RefractedText
            text="VISIONEXA'26"
            theme="dark"
            topColor="#f2f7ff"
            bottomColor="#1e293b"
            beamColor="#00d9ff"
            spectrumWarmColor="#ffffff"
            spectrumMiddleColor="#00d9ff"
            spectrumCoolColor="#0369a1"
            reveal={true}
            stagger={0.06}
            liftDuration={1.4}
            ease="power4.out"
            beamFollowsLift={false}
            animateBeam={true}
            openingDuration={4.5}
            duration={10}
            intensity={1.2}
            dispersion={0.85}
            colorIntensity={1.1}
            beamPosition={0.5}
            fixedBeam={false}
            paused={false}
            cursorMovesBeam={true}
            fontSize="clamp(1.85rem, 7.2vw, 6.5rem)"
            fontFamily="'Orbitron', 'Michroma', sans-serif"
            fontWeight={600}
            letterSpacing="1px"
            extraBold={0}
            fontHeight={85}
            cornerRounding={0}
          />
        </h1>

        {/* 2. BOXLESS CENTER-ALIGNED TAGLINES (High-Contrast Dark Scrim + Text Shadow) */}
        <div
          onMouseEnter={() => setGlitchTick((prev) => prev + 1)}
          className="relative flex flex-col items-center gap-2.5 sm:gap-4 max-w-3xl mb-8 sm:mb-12 px-6 py-4 rounded-full cursor-default"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(3, 5, 10, 0.82) 0%, rgba(3, 5, 10, 0.42) 55%, transparent 78%)',
            textShadow:
              '0 1px 4px rgba(0, 0, 0, 1), 0 4px 16px rgba(0, 0, 0, 0.98), 0 0 28px rgba(2, 4, 10, 0.95)',
          }}
        >
          {/* Line 1: MULTIVERSE 404 — REALITY NOT FOUND_ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-y-1.5 gap-x-2.5 font-['Space_Grotesk'] font-medium text-[clamp(0.85rem,3.6vw,1.3rem)] tracking-[2px] sm:tracking-[5px] uppercase leading-snug">
            <span className="text-[#00E5CC] inline-flex items-center gap-1.5">
              <span>MULTIVERSE</span>
              <GlitchEffect
                key={`404-${glitchTick}`}
                text="404"
                color="#00E5CC"
                playMode="enter"
                infinite={false}
                repeat={1}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                font={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.85rem, 3.6vw, 1.3rem)',
                  fontWeight: 600,
                }}
                shake={{ enabled: true, x: 4, y: 4 }}
                slice={{ count: 3, minHeight: 15, maxHeight: 35, intensity: 65 }}
              />
            </span>
            <span className="hidden sm:inline text-[#D6E2F0]/50">—</span>
            <span className="text-[#D6E2F0]">
              REALITY NOT FOUND<span className="blinking-cursor">_</span>
            </span>
          </div>

          {/* Line 2: WHAT IF REALITY WAS NEVER REAL? */}
          <div className="font-['Space_Grotesk'] font-medium text-[clamp(0.72rem,2.8vw,1.25rem)] tracking-[1.5px] sm:tracking-[5px] text-[#D6E2F0] uppercase leading-relaxed mt-1 sm:mt-0">
            <GlitchCharReveal
              key={`tagline-${glitchTick}`}
              words="WHAT IF REALITY WAS NEVER REAL?"
              color="#D6E2F0"
              tag="p"
              enterAnimation={{
                mode: 'oneLine',
                duration: 1.2,
                ease: 'easeOut',
                scrambleIntensity: 65,
                replay: true,
                restState: 'solid',
                position: 'above',
                flickerEnabled: false,
              }}
              hoverAnimation={{
                type: 'diffusion',
                lines: 'oneLine',
                radius: 2,
                collapse: true,
                collapseTime: 0.7,
                glitchChars: '!/{}0101_#$<',
                glitchShuffle: true,
                flickerEnabled: false,
              }}
              font={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.72rem, 2.8vw, 1.25rem)',
                letterSpacing: '2px',
                lineHeight: '1.4',
                textAlign: 'center',
                fontStyle: 'normal',
                fontWeight: 500,
              }}
            />
          </div>
        </div>

        {/* 3. SLEEK ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md">
          <a
            href="#portal"
            className="w-[225px] sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-center text-[11px] sm:text-sm font-['Space_Mono'] font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase bg-[#F2F7FF] hover:bg-white text-[#050508] rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:shadow-[0_0_32px_rgba(0,217,255,0.35)] inline-flex items-center justify-center gap-2"
            onMouseEnter={() => soundEnabled && playCyberGlitchSound()}
          >
            <span>ENTER PORTAL</span>
            <span>→</span>
          </a>
          <a
            href="#about"
            className="w-[225px] sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-center text-[11px] sm:text-sm font-['Space_Mono'] font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase bg-[#050508]/75 hover:bg-white/[0.08] backdrop-blur-md border border-white/15 text-[#F2F7FF] rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2"
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
