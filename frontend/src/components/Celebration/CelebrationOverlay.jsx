import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Trophy, ShieldAlert } from 'lucide-react';

export default function CelebrationOverlay({ type, onClose }) {
  // type can be 'four', 'six', 'wicket' or null
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!type) return;

    // Generate 30 explosive particle coordinates
    const pList = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      scale: Math.random() * 1.3 + 0.6,
      rotation: Math.random() * 360,
      emoji: type === 'six' ? ['🚀', '💥', '6️⃣', '✨', '🎆'][i % 5] : type === 'four' ? ['🔥', '4️⃣', '⚡', '🎉', '🟩'][i % 5] : ['💥', '☝️', '🔴', '🔥', '⚡'][i % 5]
    }));
    setParticles(pList);

    const timer = setTimeout(() => {
      onClose();
    }, 2200);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  if (!type) return null;

  const isSix = type === 'six';
  const isFour = type === 'four';
  const isWicket = type === 'wicket';

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-md pointer-events-none select-none overflow-hidden animate-fadeIn">
      
      {/* Exploding Particles Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
              transition: 'all 1.8s cubic-bezier(0.1, 0.8, 0.3, 1)',
              opacity: 0.9
            }}
            className="absolute text-3xl sm:text-5xl animate-bounce"
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Main Celebration Banner Box */}
      <div className="relative z-10 text-center space-y-4 px-6 py-8 rounded-3xl max-w-lg w-full mx-4 shadow-2xl backdrop-blur-xl border-4 transform animate-pulse"
        style={{
          backgroundColor: isSix ? '#121004' : isFour ? '#03140C' : '#1A0407',
          borderColor: isSix ? '#FFB800' : isFour ? '#00D26A' : '#FF3366'
        }}
      >
        {/* Animated Badge Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-2xl mx-auto transform hover:scale-110 transition"
          style={{
            backgroundColor: isSix ? '#FFB800' : isFour ? '#00D26A' : '#FF3366',
            color: '#000000'
          }}
        >
          {isSix && <span className="text-6xl font-heading font-black">6</span>}
          {isFour && <span className="text-6xl font-heading font-black">4</span>}
          {isWicket && <span className="text-5xl font-heading font-black">W</span>}
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest block"
            style={{ color: isSix ? '#FFB800' : isFour ? '#00D26A' : '#FF3366' }}
          >
            {isSix ? '🎆 MAXIMUM EXPLOSION 🎆' : isFour ? '🔥 BOUNDARY BLAST 🔥' : '🚨 WICKET BLAST 🚨'}
          </span>

          <h1 className="text-4xl sm:text-6xl font-heading font-black text-white tracking-tight mt-1">
            {isSix ? 'HUGE SIX!' : isFour ? 'CRACKER FOUR!' : 'BIG WICKET!'}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-slate-300 mt-2">
            {isSix ? 'Smashed out of the stadium! Sensational maximum hit!' : isFour ? 'Blasted gracefully through the outfield boundary!' : 'Timber! Huge breakthrough for the bowling team!'}
          </p>
        </div>

        <div className="pt-2">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-white/10 text-white border border-white/20">
            CricHeroes Live Celebration 🎉
          </span>
        </div>
      </div>

    </div>
  );
}
