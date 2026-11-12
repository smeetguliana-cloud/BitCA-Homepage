import React, { useState, useEffect, useRef } from 'react';

export interface GlitchEffectFont {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
}

export interface GlitchEffectShake {
  enabled?: boolean;
  x?: number;
  y?: number;
}

export interface GlitchEffectSlice {
  count?: number;
  minHeight?: number;
  maxHeight?: number;
  intensity?: number;
}

export interface GlitchEffectTransition {
  duration?: number;
  ease?: any;
}

export interface GlitchEffectProps {
  text?: string;
  color?: string;
  playMode?: 'enter' | 'hover' | 'always';
  infinite?: boolean;
  repeat?: number;
  transition?: GlitchEffectTransition;
  font?: GlitchEffectFont;
  shake?: GlitchEffectShake;
  slice?: GlitchEffectSlice;
  className?: string;
  style?: React.CSSProperties;
}

interface SliceLayer {
  id: number;
  clipTop: number;
  clipBottom: number;
  offsetX: number;
  offsetY: number;
  color: string;
  opacity: number;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  text = '404',
  color = '#3b82f6',
  playMode = 'enter',
  infinite = false,
  repeat = 1,
  transition = { duration: 1.2, ease: 'easeInOut' },
  font = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 'clamp(4rem, 11.5vw, 7.5rem)',
    fontWeight: 900,
  },
  shake = {
    enabled: true,
    x: 4,
    y: 4,
  },
  slice = {
    minHeight: 15,
    maxHeight: 35,
    intensity: 70,
  },
  className = '',
  style = {},
}) => {
  const [slices, setSlices] = useState<SliceLayer[]>([]);
  const [baseOffset, setBaseOffset] = useState({ x: 0, y: 0 });
  const [isGlitchingState, setIsGlitchingState] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());

  const parsedFontSize =
    typeof font.fontSize === 'number'
      ? `clamp(3.5rem, 9vw, ${font.fontSize}px)`
      : font.fontSize || 'clamp(4rem, 11.5vw, 7.5rem)';

  const durationMs = (transition.duration ?? 1.2) * 1000 * Math.max(1, repeat ?? 1);

  useEffect(() => {
    let active = true;
    startTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
    setIsGlitchingState(true);

    const glitchTick = (time: number) => {
      if (!active) return;

      const totalElapsed = time - startTimeRef.current;
      const isWithinActiveWindow = infinite || totalElapsed < durationMs || isHovered;

      if (!isWithinActiveWindow) {
        setBaseOffset({ x: 0, y: 0 });
        setSlices([]);
        setIsGlitchingState(false);
        return;
      }

      setIsGlitchingState(true);
      const elapsedSinceLastFrame = time - lastTimeRef.current;

      // Burst frame update every ~50ms
      if (elapsedSinceLastFrame > 50) {
        lastTimeRef.current = time;

        // Occasional quiet frames within the glitch burst for realistic hardware fault cadence
        const isFrameGlitching = Math.random() < 0.85;

        if (isFrameGlitching) {
          // Shake calculation
          if (shake.enabled) {
            const sx = (Math.random() - 0.5) * 2 * (shake.x ?? 4);
            const sy = (Math.random() - 0.5) * 2 * (shake.y ?? 4);
            setBaseOffset({ x: sx, y: sy });
          }

          // Slice calculation
          const sliceCount = Math.floor(Math.random() * 3) + 2;
          const newSlices: SliceLayer[] = [];
          const colors = ['#06b6d4', '#ec4899', color, '#ffffff'];

          for (let i = 0; i < sliceCount; i++) {
            const top = Math.random() * 80;
            const height =
              (slice.minHeight ?? 15) / 3 +
              Math.random() * ((slice.maxHeight ?? 35) / 2);
            const bottom = Math.min(100, top + height);
            const intensity = (slice.intensity ?? 70) / 10;
            const offsetX = (Math.random() - 0.5) * intensity * 2;
            const offsetY = (Math.random() - 0.5) * intensity * 0.4;

            newSlices.push({
              id: i,
              clipTop: top,
              clipBottom: 100 - bottom,
              offsetX,
              offsetY,
              color: colors[Math.floor(Math.random() * colors.length)],
              opacity: Math.random() * 0.7 + 0.3,
            });
          }

          setSlices(newSlices);
        } else {
          setBaseOffset({ x: 0, y: 0 });
          setSlices([]);
        }
      }

      animFrameRef.current = requestAnimationFrame(glitchTick);
    };

    animFrameRef.current = requestAnimationFrame(glitchTick);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    infinite,
    repeat,
    durationMs,
    isHovered,
    shake.enabled,
    shake.x,
    shake.y,
    slice.minHeight,
    slice.maxHeight,
    slice.intensity,
    color,
  ]);

  const containerStyle: React.CSSProperties = {
    fontFamily: font.fontFamily || "'Orbitron', sans-serif",
    fontSize: parsedFontSize,
    fontWeight: font.fontWeight || 900,
    color,
    position: 'relative',
    display: 'inline-block',
    userSelect: 'none',
    lineHeight: 1,
    ...style,
  };

  return (
    <div
      className={`glitch-effect-wrapper relative inline-block select-none cursor-default ${className}`}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Text */}
      <span
        style={{
          display: 'block',
          transform: `translate(${baseOffset.x}px, ${baseOffset.y}px)`,
          transition: 'transform 0.04s linear',
        }}
      >
        {text}
      </span>

      {/* Sliced Chromatic Aberration Layers (Active during glitch) */}
      {isGlitchingState &&
        slices.map((s) => (
          <span
            key={s.id}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              color: s.color,
              clipPath: `inset(${s.clipTop}% 0 ${s.clipBottom}% 0)`,
              transform: `translate(${s.offsetX + baseOffset.x}px, ${s.offsetY + baseOffset.y}px)`,
              opacity: s.opacity,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          >
            {text}
          </span>
        ))}

      {/* RGB Channel Highlights (Active during glitch) */}
      {isGlitchingState && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              color: '#06b6d4',
              opacity: 0.45,
              clipPath: 'inset(15% 0 65% 0)',
              transform: `translate(${-baseOffset.x - 2}px, ${baseOffset.y}px)`,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              color: '#ec4899',
              opacity: 0.45,
              clipPath: 'inset(65% 0 15% 0)',
              transform: `translate(${baseOffset.x + 2}px, ${-baseOffset.y}px)`,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};

export default GlitchEffect;
