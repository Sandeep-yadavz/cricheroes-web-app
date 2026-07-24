import React from 'react';

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
      {logo || <span className="text-xs font-bold text-[#00D26A]">{getInitials(name)}</span>}
    </div>
  );
}
