import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FanGallery, FanGalleryItem } from './fan-gallery';

const items: FanGalleryItem[] = [
  {
    src: '/posters/guest-lecture.png',
    alt: 'Guest Lectures',
    title: 'Guest Lectures',
  },
  {
    src: '/posters/hackathon.png',
    alt: 'Hackathons',
    title: 'Hackathons',
  },
  {
    src: '/posters/workshops.png',
    alt: 'Workshops',
    title: 'Workshops',
  },
  {
    src: '/posters/coding-competition.png',
    alt: 'Coding Competitions',
    title: 'Coding Competitions',
  },
  {
    src: '/posters/project-showcase.png',
    alt: 'Project Showcases',
    title: 'Project Showcases',
  },
  {
    src: '/posters/industrial-visit.png',
    alt: 'Industrial Visits',
    title: 'Industrial Visits',
  },
];

export const WhatWeDo: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [selectedPoster, setSelectedPoster] = useState<FanGalleryItem | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!selectedPoster) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPoster(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPoster]);

  return (
    <section
      id="what-we-do"
      className="overflow-x-clip py-20 sm:py-28 px-4 sm:px-8 lg:px-16 relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Clean Centered Section Header */}
        <div
          className="text-center space-y-3 mb-10 sm:mb-14 px-8 py-4 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(2, 4, 10, 0.78) 0%, rgba(2, 4, 10, 0.38) 55%, transparent 78%)',
            textShadow:
              '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 24px rgba(2, 4, 10, 0.9)',
          }}
        >
          <h2 className="font-['Orbitron'] font-semibold text-3xl sm:text-5xl text-[#F2F7FF] tracking-wide">
            What We Do
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#AFC5E8] max-w-md mx-auto">
            Engage, learn, and grow with our regular activities.
          </p>
        </div>

        {/* Interactive Fanned Poster Gallery */}
        <FanGallery
          items={items}
          cardWidth={isMobile ? 130 : 195}
          aspectRatio={0.75}
          spacing={isMobile ? 1.35 : 1.8}
          curve={isMobile ? 0.22 : 0.3}
          tilt={isMobile ? 16 : 24}
          lift={isMobile ? 20 : 30}
          spread={isMobile ? 0.08 : 0.12}
          stackFrom="left"
          speed={0.7}
          stagger={0.09}
          bounce={0.35}
          hoverSpeed={0.28}
          radius={16}
          entrance="stack"
          trigger="scroll"
          viewportStart={75}
          once={true}
          showTitle={true}
          onSelectItem={(item) => setSelectedPoster(item)}
        />
      </div>

      {/* Centered Poster Lightbox Preview Modal */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedPoster(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPoster.title || selectedPoster.alt}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPoster(null)}
              aria-label="Close poster preview"
              className="self-end p-2.5 rounded-full bg-[#050508]/90 border border-[#00D9FF]/40 text-[#F2F7FF] hover:border-[#00D9FF] hover:shadow-[0_0_20px_rgba(0,217,255,0.35)] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#050508] border border-[#00D9FF]/45 shadow-[0_12px_40px_rgba(0,217,255,0.28),0_0_32px_rgba(168,85,247,0.22)]">
              <img
                src={selectedPoster.src}
                alt={selectedPoster.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {selectedPoster.title && (
              <p className="font-['Space_Grotesk'] font-medium text-base sm:text-lg text-[#E2E8F0] tracking-wide text-center">
                {selectedPoster.title}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WhatWeDo;
