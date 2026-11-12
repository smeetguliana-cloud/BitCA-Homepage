import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
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
    { label: 'About', href: '#about' },
    { label: 'Architects', href: '#people' },
    { label: 'Portal', href: '#portal' },
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
        <div className="flex items-center justify-between">
          {/* Brand Wordmark (Orbitron) */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 font-['Orbitron'] text-sm sm:text-base font-bold tracking-widest text-[#ffffff] whitespace-nowrap shrink-0 hover:text-[#06b6d4] transition-colors"
          >
            <span>BitCA</span>
          </a>

          {/* Desktop Navigation Links (aligned cleanly to the right opposite BitCA) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-['Space_Mono'] tracking-wider uppercase text-[#94a3b8]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#06b6d4] transition-colors relative py-1 whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#94a3b8] hover:text-[#06b6d4]"
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
              className="block font-['Space_Mono'] text-sm tracking-widest text-[#94a3b8] hover:text-[#06b6d4] py-2 border-b border-white/5 uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
