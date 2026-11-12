import React from 'react';
import { X, Shield, Terminal, Award, User, Sparkles } from 'lucide-react';
import { Architect } from '../types';

interface DossierModalProps {
  architect: Architect | null;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ architect, onClose }) => {
  if (!architect) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="relative w-full max-w-xl bg-black/90 border border-[#06b6d4]/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#ec4899]/50 transition-colors"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#06b6d4] tracking-widest uppercase">
          <Terminal className="w-4 h-4 text-[#06b6d4]" />
          <span>PERSONNEL DOSSIER // {architect.codeName}</span>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar / Portrait */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-[#07070d] border border-white/20 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <img
              src={architect.image}
              alt={architect.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // If local photo not found, fall back to styled holographic avatar container
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.avatar-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
            {/* Fallback Holographic Canvas */}
            <div className="avatar-fallback hidden absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#06b6d4]/20 via-[#07070d] to-[#ec4899]/20">
              <span className="font-['Orbitron'] font-bold text-2xl text-white">
                {architect.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
              <span className="text-[10px] font-mono text-[#06b6d4] mt-1 tracking-widest">
                ARCHITECT
              </span>
            </div>
            {/* Corner Ticks */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#06b6d4]" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#ec4899]" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-['Orbitron'] font-bold text-xl sm:text-2xl text-white tracking-wide">
              {architect.name}
            </h3>
            <p className="font-mono text-sm text-[#06b6d4] mt-1">
              {architect.role} {architect.department && `· ${architect.department}`}
            </p>
            <div className="mt-2 text-xs font-mono text-[#94a3b8]">
              CATEGORY: <span className="text-[#ec4899] font-bold">{architect.category}</span>
            </div>

            {architect.bio && (
              <p className="mt-4 font-sans text-sm text-[#94a3b8] leading-relaxed">
                {architect.bio}
              </p>
            )}

            {/* Tags */}
            {architect.tags && architect.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                {architect.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-[#94a3b8] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer clearance */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
          <span className="flex items-center gap-1.5 text-[#06b6d4]">
            <Shield className="w-3.5 h-3.5" />
            CLEARANCE LEVEL: ALPHA-404
          </span>
          <span>MULTIVERSE ORG // HSNCU</span>
        </div>
      </div>
    </div>
  );
};
