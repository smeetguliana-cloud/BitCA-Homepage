import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutBitCA } from './components/AboutBitCA';
import { PeopleGallery } from './components/PeopleGallery';
import { EventsPortal } from './components/EventsPortal';
import { WhatWeDo } from './components/WhatWeDo';
import { Footer } from './components/Footer';
import { ChatbotModal } from './components/ChatbotModal';

// Import the newly added 3D background component
import CosmicCanvas from './components/CosmicCanvas';

export default function App() {
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // 3D Canvas Scroll Tracking Refs
  const scrollRef = useRef<number>(0);
  const detonationPulseRef = useRef<number>(0);

  // Sync scroll progress to feed into the WebGL shaders
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      scrollRef.current = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-[#f8fafc] font-sans relative selection:bg-[#ec4899]/30 selection:text-[#06b6d4]">
      
      {/* Fixed 3D WebGL Background Scene */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#020204]">
        <CosmicCanvas 
          scrollRef={scrollRef} 
          activeFilter="all" 
          detonationPulseRef={detonationPulseRef} 
        />
      </div>

      {/* Primary UI layer sitting transparently over the WebGL background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          <Hero soundEnabled={soundEnabled} />
          <AboutBitCA />
          <PeopleGallery soundEnabled={soundEnabled} />
          <EventsPortal soundEnabled={soundEnabled} />
          <WhatWeDo />
        </main>
        
        <Footer />
      </div>

      {/* Global Floating BitCA AI Assistant */}
      <ChatbotModal />
    </div>
  );
}