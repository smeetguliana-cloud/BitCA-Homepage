import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export interface FanGalleryItem {
  src: string;
  alt: string;
  title?: string;
  href?: string;
}

export interface FanGalleryProps {
  items: FanGalleryItem[];
  cardWidth?: number;
  aspectRatio?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  lift?: number;
  spread?: number;
  stackFrom?: 'left' | 'right' | 'center';
  speed?: number;
  stagger?: number;
  bounce?: number;
  hoverSpeed?: number;
  radius?: number;
  entrance?: 'stack' | 'fan' | 'none';
  trigger?: 'scroll' | 'mount';
  viewportStart?: number;
  once?: boolean;
  showTitle?: boolean;
  className?: string;
  onSelectItem?: (item: FanGalleryItem, index: number) => void;
}

const FLOAT_DURATIONS = ['5.5s', '5.8s', '6.1s', '6.4s', '6.6s', '6.8s'];

export const FanGallery: React.FC<FanGalleryProps> = ({
  items = [],
  cardWidth = 195,
  aspectRatio = 0.75,
  spacing = 1.8,
  curve = 0.3,
  tilt = 26,
  lift = 30,
  spread = 0.12,
  stackFrom = 'left',
  speed = 0.7,
  stagger = 0.09,
  bounce = 0.35,
  hoverSpeed = 0.28,
  radius = 18,
  entrance = 'stack',
  trigger = 'scroll',
  viewportStart = 75,
  once = true,
  showTitle = false,
  className = '',
  onSelectItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(
    trigger === 'mount' || entrance === 'none'
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (trigger === 'mount' || entrance === 'none') {
      setHasEntered(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const checkPosition = () => {
      const rect = el.getBoundingClientRect();
      const triggerY = window.innerHeight * (viewportStart / 100);
      if (rect.top <= triggerY && rect.bottom >= 0) {
        setHasEntered(true);
        return true;
      }
      return false;
    };

    if (checkPosition() && once) return;

    const bottomMarginPercent = Math.max(0, Math.min(95, 100 - viewportStart));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEntered(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setHasEntered(false);
          }
        }
      },
      {
        rootMargin: `0px 0px -${bottomMarginPercent}% 0px`,
        threshold: 0.01,
      }
    );

    observer.observe(el);

    const onScroll = () => {
      if (checkPosition() && once) {
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [trigger, entrance, viewportStart, once]);

  if (!items.length) return null;

  const n = items.length;
  const mid = (n - 1) / 2;
  const cardHeight = Math.round(cardWidth / aspectRatio);
  const stepX = cardWidth <= 150 ? cardWidth * 0.225 * spacing : cardWidth * 0.275 * spacing;
  const maxArcDrop = Math.round(curve * cardHeight * 0.42);
  const stageHeight = cardHeight + maxArcDrop + lift + 24;

  const springStiffness = 180 + bounce * 160;
  const springDamping = Math.max(12, 26 - bounce * 24);

  const activeTitle =
    showTitle && hoveredIndex !== null ? items[hoveredIndex]?.title : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center select-none ${className}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Fanned Poster Stage */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: `${stageHeight}px` }}
      >
        {items.map((item, i) => {
          const offset = i - mid;
          const norm = n > 1 ? offset / mid : 0;

          // Base fanned position
          let x = offset * stepX;
          let y = Math.pow(Math.abs(norm), 1.65) * curve * cardHeight * 0.42;
          let rotate = norm * tilt;
          let scale = 1;

          // Hover spread & lift
          const isHovered = hoveredIndex === i;
          if (hoveredIndex !== null) {
            if (isHovered) {
              y -= lift;
              rotate = norm * tilt * 0.22;
              scale = 1.06;
            } else {
              const dir = i < hoveredIndex ? -1 : 1;
              const dist = Math.abs(i - hoveredIndex);
              const spreadFactor = Math.max(0.45, 1.15 - dist * 0.16);
              x += dir * spread * cardWidth * 0.9 * spreadFactor;
            }
          }

          // Base stacking order
          let baseZ = 10 + i;
          if (stackFrom === 'right') {
            baseZ = 10 + (n - 1 - i);
          } else if (stackFrom === 'center') {
            baseZ = 10 + (n - Math.round(Math.abs(offset)));
          }
          const zIndex = isHovered ? 50 : baseZ;

          // Entrance stagger order
          let orderIdx = i;
          if (stackFrom === 'right') orderIdx = n - 1 - i;
          else if (stackFrom === 'center') orderIdx = Math.round(Math.abs(offset));

          const initialPose =
            entrance === 'none' || hasEntered
              ? { x, y, rotate, scale, opacity: 1 }
              : entrance === 'stack'
              ? { x: 0, y: 24, rotate: 0, scale: 0.9, opacity: 0 }
              : { x: x * 0.4, y: y + 32, rotate: rotate * 0.5, scale: 0.92, opacity: 0 };

          const isSettledOrHover = hoveredIndex !== null;
          const floatDelay = `${(i * 0.6).toFixed(1)}s`;
          const floatDuration = FLOAT_DURATIONS[i % FLOAT_DURATIONS.length];

          const cardContent = (
            <div
              className="fan-card-float relative w-full h-full"
              style={{
                animationDelay: floatDelay,
                animationDuration: floatDuration,
                animationPlayState: isHovered ? 'paused' : 'running',
              }}
            >
              <div
                className="relative w-full h-full overflow-hidden bg-[#050508] transition-[box-shadow,border-color] duration-300"
                style={{
                  borderRadius: `${radius}px`,
                  border: isHovered
                    ? '1px solid rgba(0, 217, 255, 0.72)'
                    : '1px solid rgba(0, 217, 255, 0.22)',
                  boxShadow: isHovered
                    ? '0 12px 32px rgba(0, 217, 255, 0.28), 0 0 24px rgba(168, 85, 247, 0.26), 0 18px 40px rgba(0, 0, 0, 0.78)'
                    : '0 14px 28px rgba(0, 0, 0, 0.65)',
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                />
              </div>
            </div>
          );

          return (
            <motion.div
              key={`${item.src}-${i}`}
              initial={initialPose}
              animate={
                hasEntered
                  ? { x, y, rotate, scale, opacity: 1 }
                  : initialPose
              }
              transition={
                isSettledOrHover
                  ? {
                      duration: hoverSpeed,
                      ease: [0.16, 1, 0.3, 1],
                    }
                  : {
                      type: 'spring',
                      stiffness: springStiffness,
                      damping: springDamping,
                      duration: speed,
                      delay: hasEntered ? orderIdx * stagger : 0,
                    }
              }
              onMouseEnter={() => setHoveredIndex(i)}
              onClick={() => {
                if (onSelectItem) {
                  onSelectItem(item, i);
                } else {
                  setHoveredIndex((prev) => (prev === i ? null : i));
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onSelectItem) {
                  e.preventDefault();
                  onSelectItem(item, i);
                }
              }}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={item.title || item.alt}
              className="absolute cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]/70 rounded-2xl"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                top: `${lift + 8}px`,
                transformOrigin: '50% 85%',
                zIndex,
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {cardContent}
                </a>
              ) : (
                cardContent
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Reserved Active Card Title Slot */}
      {showTitle && (
        <div className="mt-3 min-h-[1.5rem] flex items-center justify-center px-4">
          <span
            className={`font-['Space_Grotesk'] font-medium text-[#E2E8F0] text-xs sm:text-sm tracking-wide transition-opacity duration-200 ${
              activeTitle ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {activeTitle || '\u00A0'}
          </span>
        </div>
      )}
    </div>
  );
};

export default FanGallery;