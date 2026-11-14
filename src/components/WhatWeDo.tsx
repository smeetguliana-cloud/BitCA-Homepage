import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export const WhatWeDo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
        setInView(true);
        return true;
      }
      return false;
    };

    if (checkVisible()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);

    const onScroll = () => {
      if (checkVisible()) {
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const cardBase =
    'rounded-2xl border border-white/10 hover:border-[#00D9FF]/45 hover:shadow-[0_0_28px_rgba(0,217,255,0.16)] overflow-hidden relative transition-all duration-300 group bg-[#050508]';

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 relative overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 18, filter: 'blur(6px)' }
          }
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3"
          style={{
            textShadow:
              '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 24px rgba(2, 4, 10, 0.92)',
          }}
        >
          <h2 className="font-['Orbitron'] font-black text-3xl sm:text-5xl text-[#F2F7FF] tracking-wider">
            WHAT WE DO
            <span className="text-[#00D9FF] drop-shadow-[0_0_12px_rgba(0,217,255,0.65)]">.</span>
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#AFC5E8] tracking-wide">
            Beyond boundaries. Beyond possibilities.
          </p>
        </motion.div>

        {/* Top Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Large Feature Card — HACKATHONS */}
          <motion.article
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 20, filter: 'blur(4px)' }
            }
            transition={{ duration: 0.55, delay: inView ? 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
            className={`${cardBase} lg:col-span-6 min-h-[340px] sm:min-h-[400px] flex`}
          >
            <img
              src="/what-we-do/hackathons.png"
              alt="Hackathons"
              className="absolute inset-0 w-full h-full object-cover object-[50%_25%] brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Cool-cyan atmospheric color grading */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/50 via-transparent to-[#00D9FF]/12"
            />
            {/* Bottom-to-top dark obsidian mask */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent"
            />

            <div className="relative z-10 mt-auto p-6 sm:p-8 space-y-2 max-w-md">
              <h3 className="font-['Orbitron'] font-bold text-xl sm:text-2xl text-[#F2F7FF] tracking-wide">
                HACKATHONS
              </h3>
              <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
                Collaborate, innovate and turn ideas into working solutions.
              </p>
            </div>
          </motion.article>

          {/* Right 2x2 Sub-Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1 — GUEST LECTURES */}
            <motion.article
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(4px)' }
              }
              transition={{ duration: 0.55, delay: inView ? 0.14 : 0, ease: [0.16, 1, 0.3, 1] }}
              className={`${cardBase} min-h-[200px] sm:min-h-[210px] flex`}
            >
              <img
                src="/what-we-do/guest-lectures.png"
                alt="Guest Lectures"
                className="absolute w-3/4 h-full right-0 inset-y-0 object-cover object-top brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/45 via-transparent to-[#00D9FF]/12"
              />
              {/* Left-to-right dark gradient mask */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/85 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508]/85 via-transparent to-transparent sm:hidden"
              />

              <div className="relative z-10 mt-auto p-5 sm:p-6 space-y-1.5 max-w-[78%]">
                <h3 className="font-['Orbitron'] font-bold text-base sm:text-lg text-[#F2F7FF] tracking-wide">
                  GUEST LECTURES
                </h3>
                <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
                  Gain insights from industry experts and technology leaders.
                </p>
              </div>
            </motion.article>

            {/* Card 2 — WORKSHOPS */}
            <motion.article
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(4px)' }
              }
              transition={{ duration: 0.55, delay: inView ? 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
              className={`${cardBase} min-h-[200px] sm:min-h-[210px] flex`}
            >
              <img
                src="/what-we-do/workshops.png"
                alt="Workshops"
                className="absolute inset-0 w-full h-full object-cover object-[50%_20%] brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/45 via-transparent to-[#00D9FF]/12"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent"
              />

              <div className="relative z-10 mt-auto p-5 sm:p-6 space-y-1.5">
                <h3 className="font-['Orbitron'] font-bold text-base sm:text-lg text-[#F2F7FF] tracking-wide">
                  WORKSHOPS
                </h3>
                <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
                  Learn new technologies through practical, hands-on experiences.
                </p>
              </div>
            </motion.article>

            {/* Card 3 — CODING COMPETITIONS */}
            <motion.article
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(4px)' }
              }
              transition={{ duration: 0.55, delay: inView ? 0.26 : 0, ease: [0.16, 1, 0.3, 1] }}
              className={`${cardBase} min-h-[200px] sm:min-h-[210px] flex`}
            >
              <img
                src="/what-we-do/coding-competitions.png"
                alt="Coding Competitions"
                className="absolute inset-0 w-full h-full object-cover object-[50%_25%] brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/45 via-transparent to-[#00D9FF]/12"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent"
              />

              <div className="relative z-10 mt-auto p-5 sm:p-6 space-y-1.5">
                <h3 className="font-['Orbitron'] font-bold text-base sm:text-lg text-[#F2F7FF] tracking-wide">
                  CODING COMPETITIONS
                </h3>
                <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
                  Challenge your coding skills and compete with fellow developers.
                </p>
              </div>
            </motion.article>

            {/* Card 4 — INDUSTRIAL VISITS */}
            <motion.article
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(4px)' }
              }
              transition={{ duration: 0.55, delay: inView ? 0.32 : 0, ease: [0.16, 1, 0.3, 1] }}
              className={`${cardBase} min-h-[200px] sm:min-h-[210px] flex`}
            >
              <img
                src="/what-we-do/industrial-visits.png"
                alt="Industrial Visits"
                className="absolute inset-0 w-full h-full object-cover object-[50%_25%] brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/45 via-transparent to-[#00D9FF]/12"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent"
              />

              <div className="relative z-10 mt-auto p-5 sm:p-6 space-y-1.5">
                <h3 className="font-['Orbitron'] font-bold text-base sm:text-lg text-[#F2F7FF] tracking-wide">
                  INDUSTRIAL VISITS
                </h3>
                <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
                  Explore real-world technology and experience the industry beyond classrooms.
                </p>
              </div>
            </motion.article>
          </div>
        </div>

        {/* Bottom Full-Width Banner — PROJECT SHOWCASES */}
        <motion.article
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 20, filter: 'blur(4px)' }
          }
          transition={{ duration: 0.55, delay: inView ? 0.38 : 0, ease: [0.16, 1, 0.3, 1] }}
          className={`${cardBase} mt-5 min-h-[210px] sm:min-h-[230px] flex items-end lg:items-center`}
        >
          <img
            src="/what-we-do/project-showcases.png"
            alt="Project Showcases"
            className="absolute w-full lg:w-[68%] h-full right-0 inset-y-0 object-cover object-[50%_30%] brightness-90 contrast-105 saturate-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#031424]/45 via-transparent to-[#00D9FF]/12"
          />
          {/* Mobile bottom-to-top dark gradient mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent lg:hidden"
          />
          {/* Desktop left-to-right seamless blend mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-r from-[#050508] via-[#050508]/92 to-transparent"
          />

          <div className="relative z-10 p-6 sm:p-8 space-y-2 max-w-lg">
            <h3 className="font-['Orbitron'] font-bold text-lg sm:text-2xl text-[#F2F7FF] tracking-wide">
              PROJECT SHOWCASES
            </h3>
            <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#CBD5E1] group-hover:text-[#F2F7FF] transition-colors duration-300 leading-relaxed">
              Discover innovative ideas and see creativity transformed into reality.
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default WhatWeDo;
