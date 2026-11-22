import React, { useEffect, useRef } from 'react';
import BoxCarousel, { type CarouselItem } from './BoxCarousel';
import VisionexaCountdown from './VisionexaCountdown';
import VisionexaLogo3D from './VisionexaLogo3D';
import { FESTIVAL_DATE } from './visionexa.config';
import './visionexa.css';

const eventImages: CarouselItem[] = [
  {
    id: 'visionexa-community',
    type: 'image',
    srcUrl: '/visionexa/visionexa-community.jpg',
    alt: 'Visionexa community group portrait in the auditorium',
    objectFit: 'contain',
    objectPosition: '50% 50%',
  },
  {
    id: 'visionexa-collage-01',
    type: 'image',
    srcUrl: '/visionexa/visionexa-collage-01.jpg',
    alt: 'Visionexa technical challenges, hackathon stage, and campus highlights',
    objectFit: 'contain',
    objectPosition: '50% 50%',
  },
  {
    id: 'visionexa-collage-02',
    type: 'image',
    srcUrl: '/visionexa/visionexa-collage-02.jpg',
    alt: 'Visionexa cultural showcases, fashion walk, and live music performances',
    objectFit: 'contain',
    objectPosition: '50% 50%',
  },
  {
    id: 'visionexa-collage-03',
    type: 'image',
    srcUrl: '/visionexa/visionexa-collage-03.jpg',
    alt: 'Visionexa gaming arenas, festival courtyard, and student moments',
    objectFit: 'contain',
    objectPosition: '50% 50%',
  },
];

export const VisionexaSections: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const computeCubeSize = () => {
    if (typeof window === 'undefined') return 360;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < 360) return 195;
    if (w < 430) return 225;
    if (w < 600) return 260;
    if (w < 1024) return 310;
    return h < 820 ? 330 : 360;
  };

  const [cubeSize, setCubeSize] = React.useState<number>(computeCubeSize);

  useEffect(() => {
    const updateSize = () => setCubeSize(computeCubeSize());
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.classList.add('vx-ready');
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.vx-reveal'));
    if (targets.length === 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const revealInViewport = () => {
      const vh = window.innerHeight || 900;
      targets.forEach((el) => {
        if (el.classList.contains('is-in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh * 0.92 && rect.bottom >= 0) {
          el.classList.add('is-in');
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    revealInViewport();

    window.addEventListener('scroll', revealInViewport, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revealInViewport);
    };
  }, []);

  return (
    <div ref={rootRef} className="vx-root vx-embedded">
      {/* Section One — Original Visionexa Countdown */}
      <section
        id="visionexa-countdown"
        className="vx-section vx-countdown-section"
      >
        <div className="vx-container vx-container--narrow">
          <div className="vx-center vx-reveal">
            <h2 className="vx-h2 vx-h2--center">The countdown is on</h2>
            <p className="vx-body vx-body--center">
              Every second brings us closer to the next edition of Visionexa.
            </p>
          </div>
          <div className="vx-reveal">
            <VisionexaCountdown target={FESTIVAL_DATE} />
          </div>
        </div>
      </section>

      {/* Section Two — Original Visionexa '25 3D Gallery */}
      <section id="visionexa-gallery" className="vx-section vx-about">
        <div className="vx-container">
          <div className="vx-about__feature">
            {/* Left Side: Animated 3D Photo Cube */}
            <div className="vx-about__cube vx-reveal">
              <BoxCarousel
                items={eventImages}
                direction="right"
                imageWidth={cubeSize}
                imageHeight={cubeSize}
                animation="autoplay"
                dragSensitivity={5}
                ease={{
                  duration: 1.9,
                  delay: 1.6,
                  ease: [0.44, 0, 0.56, 1],
                }}
              />
            </div>

            {/* Right Side: Visionexa '25 Branding + Copy */}
            <div className="vx-about__copy vx-reveal">
              <div className="vx-brand-lockup">
                <VisionexaLogo3D />
                <div>
                  <span className="vx-brand-name">ABOUT VISIONEXA</span>
                  <span className="vx-brand-year"></span>
                </div>
              </div>
              <p className="vx-body">
                Visionexa is our college&rsquo;s flagship celebration of
                innovation &mdash; a festival built to bring curious minds
                together around the technologies shaping tomorrow and the
                creativity that gives them meaning.
              </p>
              <p className="vx-body">
                From hands-on technical challenges to expressive non-technical
                showcases, Visionexa is designed so every student can find a
                stage, a team, and a reason to build something remarkable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionexaSections;
