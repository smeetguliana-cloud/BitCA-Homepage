import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AboutBitCA: React.FC = () => {
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoWrapper = logoWrapperRef.current;
    if (!logoWrapper) return;

    // Subtle GSAP float animation
    const floatTween = gsap.to(logoWrapper, {
      y: -8,
      duration: 3.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      floatTween.kill();
    };
  }, []);

  const badges = ['[ AI & Cyber ]', '[ 48hr Hackathons ]', '[ Tech Workshops ]'];

  return (
    <section id="about" className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 bg-[#06b6d4]" />
          <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#06b6d4]">
            SECTION 02 // DOSSIER
          </span>
          <div className="h-[1px] flex-1 bg-[#06b6d4]/20" />
        </div>

        {/* 2-Column Center-Avoidant Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Sheer HUD panel with floating BitCA Logo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div
              ref={logoWrapperRef}
              className="relative w-60 sm:w-72 md:w-80 aspect-square bg-black/70 border border-[#06b6d4]/30 p-6 flex items-center justify-center hover:border-[#06b6d4]/70 transition-colors"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#06b6d4]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ec4899]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ec4899]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#06b6d4]" />

              <img
                src="./bitca logo.jpeg"
                alt="BitCA"
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.startsWith('/')) {
                    target.src = '/bitca logo.jpeg';
                  }
                }}
              />
            </div>
          </div>

          {/* Right: Header, Text & Sheer Badges wrapped in dark glass panel */}
          <div className="lg:col-span-7">
            <div className="bg-black/80 backdrop-blur-md border border-[#06b6d4]/30 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
              
              <div className="space-y-2">
                <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#94a3b8] block">
                  DEPARTMENT OF COMPUTER APPLICATIONS
                </span>
                <h2 className="font-['Orbitron'] font-bold text-3xl sm:text-4xl text-[#ffffff] tracking-wide">
                  About BitCA
                </h2>
              </div>

              <p className="font-['Plus_Jakarta_Sans'] text-base text-white leading-relaxed">
                BitCA v2.4 is the official tech club of the Department of Computer Applications at K.C. College, under HSNC University. We are a community of passionate tech enthusiasts dedicated to exploring the ever-evolving world of technology, with a primary focus on Artificial Intelligence, emerging technologies, and hands-on technical learning.
We regularly organize interactive workshops, seminars, and events on topics like AI, Cybersecurity, Web Development, and Data Science. At BitCA, we encourage innovation and knowledge sharing to prepare students for the tech-driven future. Whether you're a beginner or an advanced learner, BitCA is the place for you to innovate, explore, and create.
              </p>

              {/* 3 Sheer Pill-Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-['Space_Mono'] text-xs text-[#06b6d4] px-4 py-2 bg-black/70 border border-[#06b6d4]/40 hover:border-[#ec4899] hover:text-white transition-colors"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* HUD Status line */}
              <div className="pt-4 border-t border-[#06b6d4]/20 flex items-center justify-between text-xs font-['Space_Mono'] text-[#94a3b8]">
                <span>STATUS: OPERATIONAL</span>
                <span>EST. 2024 // K.C. COLLEGE</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
