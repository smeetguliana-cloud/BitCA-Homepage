import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ORIGIN', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'ARCHITECTS', href: '#people' },
    { label: 'PORTAL', href: '#portal' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[44px] bg-black border-b border-[#06b6d4]/15">
      <div className="w-full h-full px-6 flex items-center justify-between">
        {/* Brand Wordmark (Orbitron) */}
        <a
          href="#hero"
          className="font-['Orbitron'] text-sm font-bold tracking-wider text-white hover:text-[#06b6d4] transition-colors select-none"
        >
          BitCA
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-['Space_Mono'] tracking-wider text-[#94a3b8]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors uppercase whitespace-nowrap"
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
            className="p-1.5 text-[#94a3b8] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-[#06b6d4]/20 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-['Space_Mono'] text-xs tracking-wider text-[#94a3b8] hover:text-white py-1.5 border-b border-white/5 uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
