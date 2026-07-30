import React from 'react';
import { Flame, Zap, Sparkles, Shield, Trophy } from 'lucide-react';

export default function TeamLogo({ logo, name = "Team", size = "md", className = "" }) {
  const isUrl = logo && (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/'));

  const sizeClasses = {
    sm: "w-7 h-7 text-sm rounded-lg",
    md: "w-10 h-10 text-xl rounded-xl",
    lg: "w-14 h-14 text-3xl rounded-2xl",
    xl: "w-20 h-20 text-5xl rounded-3xl"
  }[size] || "w-10 h-10 text-xl rounded-xl";

  const getInitials = (n) => {
    return (n || "TM")
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  };

  // Clean up Mojibake characters like ðŸ”¥, Ã°, etc.
  const isCorrupt = logo && (logo.includes('ð') || logo.includes('Ã') || logo.includes('Ÿ') || logo.length > 8);

  const getCleanIconOrEmoji = () => {
    if (!logo || isCorrupt) {
      if (name.toLowerCase().includes('mumbai') || name.toLowerCase().includes('striker')) return <Flame className="w-3/5 h-3/5 text-orange-400" />;
      if (name.toLowerCase().includes('delhi') || name.toLowerCase().includes('dynamite')) return <Zap className="w-3/5 h-3/5 text-amber-400" />;
      if (name.toLowerCase().includes('bangalore') || name.toLowerCase().includes('blaster')) return <Sparkles className="w-3/5 h-3/5 text-[#00D26A]" />;
      return <span className="text-xs font-bold text-[#00D26A]">{getInitials(name)}</span>;
    }
    return logo;
  };

  if (isUrl) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${sizeClasses} object-cover border border-slate-700 shadow-md ${className}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-slate-700/80 flex items-center justify-center font-heading font-black shadow-md shrink-0 ${className}`}
    >
      {getCleanIconOrEmoji()}
    </div>
  );
}
