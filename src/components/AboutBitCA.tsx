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

  return (
    <section id="about" className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Center-Avoidant Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Floating BitCA Logo directly over the cosmic background */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div
              ref={logoWrapperRef}
              className="relative w-60 sm:w-72 md:w-80 aspect-square flex items-center justify-center"
            >
              <img
                src="./bitca logo.jpeg"
                alt="BitCA"
                className="w-full h-full object-contain drop-shadow-[0_0_24px_rgba(6,182,212,0.35)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.startsWith('/')) {
                    target.src = '/bitca logo.jpeg';
                  }
                }}
              />
            </div>
          </div>

          {/* Right: Header & Copy wrapped in dark glass panel */}
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
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
