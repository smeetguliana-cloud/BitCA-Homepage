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
        <div className="bg-black/80 backdrop-blur-md p-6 sm:p-8 border border-[#06b6d4]/30 rounded-xl max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 bg-[#ec4899]" />
            <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#ec4899]">
              PERSONNEL ROSTER // MULTIVERSE 404
            </span>
            <div className="h-[1px] flex-1 bg-[#ec4899]/20" />
          </div>
          <h2 className="font-['Orbitron'] font-black text-3xl sm:text-5xl text-[#ffffff] tracking-wide mb-3">
            The Architects
          </h2>
          <p className="max-w-xl font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-white">
            The visionary leaders, faculty mentors, core executive leads, and departmental heads driving the Multiverse 404 ecosystem.
          </p>
        </div>

        {/* 5 Sequential Sections Stacked Vertically */}
        {SECTIONS.map((sec, secIndex) => {
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
              <div className="flex items-center justify-between border-b border-[#06b6d4]/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-['Space_Mono'] text-xs text-[#06b6d4] font-bold">
                    0{secIndex + 1} //
                  </span>
                  <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {sec.title}
                  </h3>
                </div>
                <span className="font-['Space_Mono'] text-xs text-[#94a3b8] tracking-widest uppercase">
                  {members.length} ARCHITECTS
                </span>
              </div>

              {/* 3D Coverflow Slideshow Gallery */}
              <Smooth3DSlideshow
                slides={formattedSlides}
                cardWidth={280}
                cardHeight={373}
                gap={15}
                autoplay={true}
                titleColor="#06b6d4"
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
