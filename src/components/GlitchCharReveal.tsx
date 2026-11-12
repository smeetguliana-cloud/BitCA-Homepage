import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface GlitchCharRevealFont {
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: string;
  whiteSpace?: 'nowrap' | 'normal' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
}

export interface GlitchCharRevealEnterAnimation {
  type?: string;
  ease?: string;
  duration?: number;
  collapse?: boolean;
  collapseTime?: number;
  [key: string]: any;
}

export interface GlitchCharRevealHoverAnimation {
  type?: string;
  mode?: string;
  radius?: number;
  scrambleIntensity?: number;
  glitchShuffle?: boolean;
  flickerEnabled?: boolean;
  hoverFlickerEnabled?: boolean;
  flickerColor?: string;
  flickerIntensity?: number;
  flickerSpeed?: number;
  [key: string]: any;
}

export interface GlitchCharRevealProps {
  words?: string;
  text?: string;
  tag?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  color?: string;
  font?: GlitchCharRevealFont;
  textAlign?: 'left' | 'center' | 'right';
  lines?: 'oneLine' | 'multiLine';
  glitchChars?: string;
  enterAnimation?: GlitchCharRevealEnterAnimation;
  hoverAnimation?: GlitchCharRevealHoverAnimation;
  flickerColor?: string;
  flickerEnabled?: boolean;
  flickerIntensity?: number;
  flickerSpeed?: number;
  replay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

interface CharState {
  target: string;
  current: string;
  isResolved: boolean;
  glitchColor: string | null;
}

export const GlitchCharReveal: React.FC<GlitchCharRevealProps> = ({
  words,
  text,
  tag = 'p',
  color = '#94a3b8',
  font = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '1.125rem',
    fontStyle: 'italic',
    letterSpacing: '0.08em',
    lineHeight: '1.6',
  },
  textAlign = 'left',
  lines = 'oneLine',
  glitchChars = '0101_#$<>/!/{}',
  enterAnimation = {
    type: 'tween',
    ease: 'easeOut',
    duration: 1.6,
    collapse: true,
    collapseTime: 0.8,
  },
  hoverAnimation = {
    type: 'diffusion',
    mode: 'solid',
    radius: 12,
    scrambleIntensity: 60,
    glitchShuffle: true,
    flickerEnabled: true,
    flickerColor: '#ec4899',
    flickerIntensity: 70,
    flickerSpeed: 14,
  },
  flickerColor = '#06b6d4',
  flickerEnabled = true,
  flickerIntensity = 70,
  flickerSpeed = 14,
  replay = true,
  className = '',
  style = {},
}) => {
  const targetText = words || text || 'what if reality was never real?';
  const chars = glitchChars.length > 0 ? glitchChars : '0101_#$<>/!/{}';
  
  const [charStates, setCharStates] = useState<CharState[]>(() =>
    targetText.split('').map((char) => ({
      target: char,
      current: char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)],
      isResolved: false,
      glitchColor: null,
    }))
  );

  const animRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isAnimatingRef = useRef(false);

  const getRandomChar = useCallback(() => {
    return chars[Math.floor(Math.random() * chars.length)];
  }, [chars]);

  const startRevealAnimation = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    isAnimatingRef.current = true;
    const durationMs = (enterAnimation.duration || 1.6) * 1000;
    const totalChars = targetText.length;
    const startTime = performance.now();
    let lastGlitchTime = startTime;
    const glitchInterval = 1000 / (flickerSpeed || 14);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Characters resolve progressively from left to right
      const resolvedIndex = Math.floor(progress * totalChars);

      const shouldUpdateGlitch = now - lastGlitchTime >= glitchInterval;
      if (shouldUpdateGlitch) {
        lastGlitchTime = now;
      }

      setCharStates((prev) =>
        prev.map((item, idx) => {
          if (item.target === ' ') {
            return { ...item, current: ' ', isResolved: true, glitchColor: null };
          }

          if (idx < resolvedIndex) {
            return {
              ...item,
              current: item.target,
              isResolved: true,
              glitchColor: null,
            };
          }

          // Unresolved character - scramble & flicker
          if (shouldUpdateGlitch) {
            const hasFlicker =
              flickerEnabled && Math.random() * 100 < (flickerIntensity || 70);
            return {
              ...item,
              current: getRandomChar(),
              isResolved: false,
              glitchColor: hasFlicker
                ? Math.random() > 0.4
                  ? flickerColor
                  : '#ec4899'
                : null,
            };
          }

          return item;
        })
      );

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        // Finalize all characters
        setCharStates(
          targetText.split('').map((char) => ({
            target: char,
            current: char,
            isResolved: true,
            glitchColor: null,
          }))
        );
        isAnimatingRef.current = false;
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, [
    targetText,
    enterAnimation.duration,
    flickerSpeed,
    flickerEnabled,
    flickerIntensity,
    flickerColor,
    getRandomChar,
  ]);

  // Initial mount trigger
  useEffect(() => {
    startRevealAnimation();
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [startRevealAnimation]);

  // Hover scramble effect (diffusion & hardware fault flicker)
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const hoverColor = hoverAnimation.flickerColor || '#ec4899';
    const scrambleDuration = 650;
    const startTime = performance.now();
    let lastGlitchTime = startTime;
    const glitchInterval = 1000 / (hoverAnimation.flickerSpeed || 14);

    const hoverStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / scrambleDuration);
      const shouldUpdateGlitch = now - lastGlitchTime >= glitchInterval;
      if (shouldUpdateGlitch) lastGlitchTime = now;

      setCharStates((prev) =>
        prev.map((item, idx) => {
          if (item.target === ' ') return item;

          // As progress nears 1, characters settle back to resolved target
          const settleThreshold = (idx / targetText.length) * 0.8;
          if (progress > settleThreshold + 0.2) {
            return {
              ...item,
              current: item.target,
              isResolved: true,
              glitchColor: null,
            };
          }

          if (shouldUpdateGlitch) {
            const isFlickering =
              Math.random() * 100 < (hoverAnimation.scrambleIntensity || 60);
            return {
              ...item,
              current: getRandomChar(),
              isResolved: false,
              glitchColor: isFlickering ? hoverColor : flickerColor,
            };
          }

          return item;
        })
      );

      if (progress < 1) {
        animRef.current = requestAnimationFrame(hoverStep);
      } else {
        setCharStates(
          targetText.split('').map((char) => ({
            target: char,
            current: char,
            isResolved: true,
            glitchColor: null,
          }))
        );
      }
    };

    animRef.current = requestAnimationFrame(hoverStep);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const handleClick = () => {
    if (replay) {
      startRevealAnimation();
    }
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: font.fontFamily || "'Space Mono', monospace",
    fontSize: font.fontSize || '1.125rem',
    fontStyle: font.fontStyle || 'normal',
    fontWeight: (font.fontWeight as any) || 'normal',
    letterSpacing: font.letterSpacing || 'normal',
    lineHeight: font.lineHeight || 'normal',
    textAlign: (font.textAlign as any) || (textAlign as any) || 'left',
    color: color || '#94a3b8',
    whiteSpace: font.whiteSpace || (lines === 'oneLine' ? 'nowrap' : 'normal'),
    display: 'inline-block',
    cursor: replay ? 'pointer' : 'default',
    ...style,
  };

  const TagComponent = tag as keyof React.JSX.IntrinsicElements;

  return (
    <TagComponent
      className={`glitch-char-reveal select-none transition-colors duration-200 ${className}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={replay ? 'Click to replay glitch scramble' : undefined}
    >
      {charStates.map((c, i) => {
        if (c.target === ' ') {
          return <span key={i}>&nbsp;</span>;
        }

        const isGlitch = !c.isResolved || c.glitchColor !== null;
        const charColor = c.glitchColor ? c.glitchColor : isGlitch ? flickerColor : color;

        return (
          <span
            key={i}
            className="inline-block transition-colors duration-75"
            style={{
              color: charColor,
              textShadow: c.glitchColor
                ? `0 0 8px ${c.glitchColor}`
                : isGlitch
                ? `0 0 6px ${flickerColor}`
                : 'none',
              transform: isGlitch ? 'translateY(-0.5px)' : 'none',
            }}
          >
            {c.current}
          </span>
        );
      })}
    </TagComponent>
  );
};

export default GlitchCharReveal;
