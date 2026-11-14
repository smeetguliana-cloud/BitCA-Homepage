import React from 'react';
import { ArrowUp, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#8B5CF6]/25 bg-[#050508]/90 backdrop-blur-xl relative z-10 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Brand & Institution */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] inline-block shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
            <span className="font-['Orbitron'] font-bold text-base text-[#F2F7FF] tracking-widest">
              MULTIVERSE 404
            </span>
          </div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#94a3b8] max-w-sm">
            The official annual technology symposium presented by BitCA v2.4. Department of Computer Applications, K.C. College, HSNC University.
          </p>
          <p className="font-['Space_Mono'] text-[11px] text-[#94a3b8]/60">
            © 2026 BitCA Tech Club. All dimensions reserved.
          </p>
        </div>

        {/* Center: Navigation Mirror */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-['Space_Mono'] text-[#94a3b8]">
          <a href="#hero" className="hover:text-[#C084FC] transition-colors">
            ORIGIN
          </a>
          <a href="#about" className="hover:text-[#C084FC] transition-colors">
            ABOUT BITCA
          </a>
          <a href="#people" className="hover:text-[#C084FC] transition-colors">
            THE ARCHITECTS
          </a>
          <a href="#events-trigger" className="hover:text-[#F472B6] transition-colors">
            PORTAL
          </a>
        </div>

        {/* Right: Instagram & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/bitcav2.4?vrfl=aWViamY2ZmQzb2xv"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#050508]/85 border border-[#A855F7]/40 text-[#C084FC] hover:text-[#F472B6] hover:border-[#EC4899]/70 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            type="button"
            className="p-2 bg-[#050508]/85 border border-[#A855F7]/40 text-[#C084FC] hover:text-[#F2F7FF] hover:border-[#EC4899]/70 transition-colors"
            title="Scroll to dimension origin"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
