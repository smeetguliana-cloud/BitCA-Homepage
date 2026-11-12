import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { playCardHoverSound } from '../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundEnabled, onToggleSound }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Origin', href: '#hero' },
    { label: 'About BitCA', href: '#about' },
    { label: 'The Architects', href: '#people' },
    { label: 'Portal', href: '#events-trigger' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-black/90 border-b border-[#06b6d4]/30 py-3'
          : 'bg-black/60 border-b border-[#06b6d4]/15 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Brand Wordmark (Orbitron, hard corner badge) */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 font-['Orbitron'] text-sm sm:text-base font-bold tracking-widest text-[#ffffff] whitespace-nowrap shrink-0 hover:text-[#06b6d4] transition-colors"
            onMouseEnter={() => soundEnabled && playCardHoverSound()}
          >
            
            <span>BitCA v2.4</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-['Space_Mono'] tracking-wider uppercase text-[#94a3b8]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#06b6d4] transition-colors relative py-1 whitespace-nowrap shrink-0"
                onMouseEnter={() => soundEnabled && playCardHoverSound()}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Controls & Portal CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleSound}
              type="button"
              className="p-2 bg-black/70 border border-[#06b6d4]/30 text-[#94a3b8] hover:text-[#06b6d4] hover:border-[#06b6d4] transition-colors"
              title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
              aria-label="Toggle audio effects"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#06b6d4]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <a
              href="#events-trigger"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 font-['Space_Mono'] text-xs uppercase tracking-widest text-white bg-black/70 hover:bg-[#06b6d4]/10 border border-[#06b6d4]/40 hover:border-[#ec4899] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all whitespace-nowrap shrink-0"
              onMouseEnter={() => soundEnabled && playCardHoverSound()}
            >
              [ BREACH PORTAL ]
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-[#94a3b8] hover:text-[#06b6d4]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07070d]/98 border-b border-[#06b6d4]/30 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-['Space_Mono'] text-sm tracking-widest text-[#94a3b8] hover:text-[#06b6d4] py-2 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#events-trigger"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center w-full py-3 font-['Space_Mono'] text-xs uppercase tracking-widest text-white bg-[#06b6d4]/15 border border-[#06b6d4]/40"
          >
            [ BREACH PORTAL ]
          </a>
        </div>
      )}
    </header>
  );
};
