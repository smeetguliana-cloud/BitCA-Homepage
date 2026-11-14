import React from 'react';
import { ARCHITECTS, SECTIONS } from '../data/people';
import { Smooth3DSlideshow } from './Smooth3DSlideshow';

interface PeopleGalleryProps {
  soundEnabled: boolean;
}

export const PeopleGallery: React.FC<PeopleGalleryProps> = () => {
  return (
    <section id="people" className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 relative">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Main Section Header */}
        <div
          className="text-center mx-auto max-w-2xl px-4 py-3 space-y-3"
          style={{
            textShadow:
              '0 2px 6px rgba(0, 0, 0, 0.98), 0 4px 18px rgba(0, 0, 0, 0.95), 0 0 28px rgba(2, 4, 10, 0.9)',
          }}
        >
          <h2 className="font-['Orbitron'] font-black text-3xl sm:text-5xl text-[#F2F7FF] tracking-wide">
            The Architects
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#F2F7FF]/90">
            The visionary leaders, faculty mentors, core executive leads, and departmental heads driving the Multiverse 404 ecosystem.
          </p>
        </div>

        {/* 5 Sequential Sections Stacked Vertically */}
        {SECTIONS.map((sec) => {
          const members = ARCHITECTS.filter((p) => p.category === sec.category);

          const formattedSlides = members.map((person) => ({
            image: { src: person.image, alt: person.name },
            title:
              sec.title === 'Heads of Department' || sec.title === 'HODs' || sec.category === 'Heads of Department'
                ? `${person.name}\n${person.role || ''}`
                : person.name,
          }));

          return (
            <div key={sec.category} className="space-y-6">
              
              {/* Category Header */}
              <div
                className="flex flex-col items-center text-center mx-auto space-y-3"
                style={{
                  textShadow:
                    '0 2px 6px rgba(0, 0, 0, 0.98), 0 4px 18px rgba(0, 0, 0, 0.95), 0 0 28px rgba(2, 4, 10, 0.9)',
                }}
              >
                <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-[#F2F7FF] tracking-wide">
                  {sec.title}
                </h3>
                <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent" />
              </div>

              {/* 3D Coverflow Slideshow Gallery */}
              <Smooth3DSlideshow
                slides={formattedSlides}
                cardWidth={280}
                cardHeight={373}
                gap={15}
                autoplay={true}
                titleColor="#FCD34D"
                transition={{
                  type: 'tween',
                  duration: 1.2,
                  delay: 3.5,
                  ease: 'easeInOut',
                }}
              />

            </div>
          );
        })}

      </div>
    </section>
  );
};

export default PeopleGallery;
