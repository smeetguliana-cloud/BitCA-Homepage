import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SlideItem {
  image: {
    src: string;
    alt: string;
  };
  title?: string;
}

export interface Smooth3DSlideshowProps {
  slides: SlideItem[];
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  autoplayDirection?: 'leftToRight' | 'rightToLeft';
  titleColor?: string;
  className?: string;
  style?: React.CSSProperties;
  transition?: {
    type?: string;
    duration?: number;
    ease?: any;
    delay?: number;
  };
}

export const Smooth3DSlideshow: React.FC<Smooth3DSlideshowProps> = ({
  slides = [],
  cardWidth = 280,
  cardHeight = 373,
  gap = 15,
  autoplay = false,
  autoplayInterval = 4000,
  autoplayDirection = 'rightToLeft',
  titleColor = '#06b6d4',
  className = '',
  style = {},
  transition,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = slides.length;
  const isStatic = totalSlides <= 1;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const step = useCallback(
    (dir: number) => {
      if (dir > 0) nextSlide();
      else if (dir < 0) prevSlide();
    },
    [nextSlide, prevSlide]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (isStatic) return;
      setCurrentIndex((curr) => (index === curr ? (curr + 1) % totalSlides : index));
    },
    [isStatic, totalSlides]
  );

  // Smart Autoplay Timer Reset (clears on slide change to prevent collision & double skips)
  useEffect(() => {
    if (isStatic || !autoplay || totalSlides < 2) return;
    const delaySec = transition?.delay ?? (autoplayInterval ? autoplayInterval / 1000 : 3.5);
    const ms = Math.max(0.3, delaySec) * 1000;
    const dir = autoplayDirection === 'leftToRight' ? -1 : 1;
    const id = window.setTimeout(() => step(dir), ms);
    return () => window.clearTimeout(id);
  }, [
    isStatic,
    autoplay,
    autoplayDirection,
    transition?.delay,
    autoplayInterval,
    totalSlides,
    step,
    currentIndex,
  ]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  };

  if (totalSlides === 0) {
    return null;
  }

  // Visible window of slides
  const maxVisibleOffset = 3;

  const transitionDuration = transition?.duration ? `${transition.duration}s` : '0.55s';
  const transitionEase =
    transition?.ease === 'easeInOut'
      ? 'cubic-bezier(0.42, 0, 0.58, 1)'
      : Array.isArray(transition?.ease)
      ? `cubic-bezier(${transition.ease.join(', ')})`
      : 'cubic-bezier(0.16, 1, 0.3, 1)';

  const rootStyle: React.CSSProperties = {
    ...style,
  };

  return (
    <div
      ref={containerRef}
      style={rootStyle}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={isStatic ? undefined : onKeyDown}
      className={`relative w-full overflow-hidden select-none py-8 flex flex-col items-center focus:outline-none ${className}`}
    >
      {/* 3D Stage Viewport */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: `${cardHeight + 90}px`,
          perspective: '1200px',
        }}
      >
        {slides.map((slide, index) => {
          let offset = index - currentIndex;

          // Wrap offset for smooth continuous carousel feeling
          if (offset < -Math.floor(totalSlides / 2)) {
            offset += totalSlides;
          } else if (offset > Math.floor(totalSlides / 2)) {
            offset -= totalSlides;
          }

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          if (absOffset > maxVisibleOffset) {
            return null;
          }

          // 3D Coverflow positioning formulas
          const xOffset = offset * (cardWidth * 0.65 + gap);
          const zOffset = -absOffset * 140;
          const rotateY = isCenter ? 0 : offset < 0 ? 38 : -38;
          const scale = isCenter ? 1 : Math.max(0.72, 1 - absOffset * 0.12);
          const opacity = isCenter ? 1 : Math.max(0.25, 0.85 - absOffset * 0.22);
          const zIndex = 50 - absOffset * 10;

          // Title formatting: line 1 = Name, line 2 = Role
          const titleLines = slide.title ? slide.title.split('\n') : [];
          const nameText = titleLines[0] || '';
          const roleText = titleLines.slice(1).join(' - ') || '';

          return (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: !isStatic ? 'auto' : 'none',
                transition: `transform ${transitionDuration} ${transitionEase}, opacity ${transitionDuration} ease`,
              }}
              className={`absolute top-0 rounded-xl overflow-hidden cursor-pointer bg-black/90 border transition-all duration-300 ${
                isCenter
                  ? 'border-[#06b6d4] shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                  : 'border-[#06b6d4]/20 hover:border-[#06b6d4]/50'
              }`}
            >
              {/* Photo Image */}
              <div className="relative w-full h-full bg-[#07070d]">
                <img
                  src={slide.image.src}
                  alt={slide.image.alt}
                  className="w-full h-full object-cover object-center pointer-events-none filter brightness-100 contrast-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.startsWith('/')) {
                      target.src = '/' + slide.image.src.replace(/^(\.\/|\/)/, '');
                    }
                  }}
                />

                {/* Scrim Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent transition-opacity duration-300 ${
                    isCenter ? 'opacity-95' : 'opacity-70'
                  }`}
                />

                {/* Darkening Veil for side cards */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                )}

                {/* Title Overlay at Bottom */}
                {slide.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                    <h4 className="font-['Orbitron'] text-base sm:text-lg font-bold text-white tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {nameText}
                    </h4>
                    {roleText && (
                      <p
                        className="font-['Space_Mono'] text-xs font-bold uppercase mt-1 tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                        style={{ color: titleColor }}
                      >
                        {roleText}
                      </p>
                    )}
                  </div>
                )}

                {/* Tactical Corner Ticks */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#06b6d4] pointer-events-none" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ec4899] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ec4899] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#06b6d4] pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-4 z-30">
        <button
          type="button"
          onClick={prevSlide}
          className="p-2.5 rounded-lg bg-black/70 border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/20 hover:border-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Index Telemetry Badge */}
        <div className="font-['Space_Mono'] text-xs tracking-widest text-[#94a3b8] px-3 py-1 bg-black/60 border border-white/10 rounded">
          <span className="text-[#06b6d4] font-bold">
            {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
          </span>
          <span className="text-white/30 mx-1.5">/</span>
          <span>{totalSlides < 10 ? `0${totalSlides}` : totalSlides}</span>
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="p-2.5 rounded-lg bg-black/70 border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/20 hover:border-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Smooth3DSlideshow;
