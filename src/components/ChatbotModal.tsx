import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const KNOWLEDGE_BASE: Record<string, string> = {
  bitca: 'BitCA v2.4 is the official tech club of the Department of Computer Applications at K.C. College, under HSNC University. We explore emerging tech, AI, cloud engineering, and hands-on workshops.',
  visionexa: 'Visionexa \'26 is our flagship inter-collegiate tech fest featuring seven dimensional universes: Techverse, Gameverse, Vibeverse, AIverse, Cyberverse, Humanverse, and Metaverse with competitive prize pools!',
  'kc college': 'K.C. College is a premier heritage institution in Churchgate, Mumbai, operating under HSNC University.',
  principal: 'Dr. Tejashree V. Shanbhag is the I/C Principal of K.C. College, bringing 30+ years of scholarly excellence and guidance.',
  vc: 'Dr. Hemlata K. Baghla is the Vice Chancellor of HSNC University. She completed her Ph.D. at age 25, has published over 200 research papers, and holds the honorary rank of Colonel.',
  geeta: 'Ms. Geeta Brijwani is the Coordinator for BCA (M.Sc, M.Phil, MBA) and has guided hundreds of students to tech industry leadership.',
  hackathon: 'The Visionexa 24h Hackathon challenges teams of 2-4 to build functional tech prototypes. Prize pool is ₹15,000 + trophy + certificates!',
  'squid game': 'The Squid Game Survival Trials feature 5 intense challenge rounds: Ddakji, Blindfold Maze, Flip Stones, Marbles, and the Escape Room.',
  roboverse: 'Roboverse is our robotics and AI hardware exhibition on Day 1 in the Tech Exhibition Hall.',
  events: 'Our 7 Universes host over 24 events: Hackathons, Console Esports, Battle Royale, Spotlight Jam, Dance Cyphers, CTF Security, and VR Immersions!'
};

export const ChatbotModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'bot' | 'user' }>>([
    {
      text: 'Greetings! I am the BitCA AI Assistant. Ask me about our 7 Universes, Visionexa \'26 events, K.C. College, or club activities!',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    const query = input.trim();
    if (!query) return;

    const newMessages = [...messages, { text: query, sender: 'user' as const }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = "That's an intriguing question! I can provide info about our Seven Universes, Visionexa '26 events, registration procedures, K.C. College, or our leadership team. Try asking about 'Hackathon', 'Squid Game', or 'Universes'!";

      for (const [key, val] of Object.entries(KNOWLEDGE_BASE)) {
        if (lower.includes(key)) {
          reply = val;
          break;
        }
      }

      setMessages((prev) => [...prev, { text: reply, sender: 'bot' }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-[#050508] shadow-[0_0_24px_rgba(0,217,255,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Toggle BitCA AI Chatbot"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6"/> : <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6"/>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:bottom-24 sm:right-6 z-50 sm:w-96 bg-[#050508]/95 backdrop-blur-2xl border border-[#00D9FF]/30 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#090D1A] to-[#11182E] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/25">
                <Bot className="w-4 h-4"/>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F2F7FF] font-['Orbitron'] tracking-wider">
                  BitCA AI Assistant
                </h4>
                <span className="text-[10px] text-[#00E5CC] font-['Space_Mono'] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4"/>
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 font-['Space_Grotesk'] text-xs sm:text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#00D9FF]/15 text-[#00D9FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5"/>
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00D9FF] text-[#050508] font-medium rounded-br-none'
                      : 'bg-white/[0.06] text-[#F2F7FF]/90 border border-white/10 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/10 bg-[#04060C] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about events, hackathon, KC College..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#00D9FF] text-[#F2F7FF] font-['Space_Grotesk'] text-xs outline-none transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#00D9FF] text-[#050508] hover:bg-[#38E2FF] transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
