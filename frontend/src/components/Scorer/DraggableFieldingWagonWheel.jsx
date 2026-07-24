import React, { useState, useRef } from 'react';
import { Target, Shield, Move, RotateCcw, AlertTriangle, CheckCircle, Lock, Compass } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const INITIAL_FIELDERS = [
  { id: 'f1', name: 'Wicket Keeper', zone: 'Keeper', x: 200, y: 310, isFixed: true },
  { id: 'f2', name: '1st Slip', zone: 'Slips', x: 225, y: 315, isFixed: false },
  { id: 'f3', name: 'Point', zone: 'Point', x: 280, y: 200, isFixed: false },
  { id: 'f4', name: 'Cover', zone: 'Cover', x: 260, y: 150, isFixed: false },
  { id: 'f5', name: 'Mid Off', zone: 'Mid Off', x: 220, y: 130, isFixed: false },
  { id: 'f6', name: 'Mid On', zone: 'Mid On', x: 180, y: 130, isFixed: false },
  { id: 'f7', name: 'Mid Wicket', zone: 'Mid Wicket', x: 140, y: 160, isFixed: false },
  { id: 'f8', name: 'Square Leg', zone: 'Square Leg', x: 120, y: 200, isFixed: false },
  { id: 'f9', name: 'Fine Leg', zone: 'Fine Leg', x: 140, y: 280, isFixed: false },
  { id: 'f10', name: 'Third Man', zone: 'Third Man', x: 290, y: 290, isFixed: false },
  { id: 'f11', name: 'Bowler', zone: 'Bowler', x: 200, y: 145, isFixed: true }
];

export default function DraggableFieldingWagonWheel({ onZoneSelect, selectedZone = "Cover" }) {
  const { match } = useCricket();
  const [fielders, setFielders] = useState(INITIAL_FIELDERS);
  const [draggingId, setDraggingId] = useState(null);
  const [shotMarker, setShotMarker] = useState({ x: 280, y: 120, zone: selectedZone });
  const [isPowerplay, setIsPowerplay] = useState(true);
  const svgRef = useRef(null);

  // Convert mouse/touch coords to SVG 400x400 viewBox space
  const getSVGCoords = (e) => {
    if (!svgRef.current) return { x: 200, y: 200 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.round(((clientX - rect.left) / rect.width) * 400);
    const y = Math.round(((clientY - rect.top) / rect.height) * 400);
    return { x: Math.max(10, Math.min(390, x)), y: Math.max(10, Math.min(390, y)) };
  };

  const handlePointerDown = (id, isFixed, e) => {
    e.stopPropagation();
    if (isFixed) return; // Keeper & Bowler are fixed
    setDraggingId(id);
  };

  const handlePointerMove = (e) => {
    if (!draggingId) return;
    const { x, y } = getSVGCoords(e);

    if (draggingId === 'shot_marker') {
      const zone = determineZone(x, y);
      setShotMarker({ x, y, zone });
      if (onZoneSelect) onZoneSelect(zone);
    } else {
      setFielders((prev) =>
        prev.map((f) => {
          if (f.id === draggingId && !f.isFixed) {
            return { ...f, x, y, zone: determineZone(x, y) };
          }
          return f;
        })
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Determine Cricket Zone based on coordinates
  const determineZone = (x, y) => {
    const dx = x - 200;
    const dy = y - 200;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (angle >= -45 && angle < 15) return 'Cover';
    if (angle >= 15 && angle < 65) return 'Point';
    if (angle >= 65 && angle < 120) return 'Third Man';
    if (angle >= 120 && angle < 160) return 'Fine Leg';
    if (angle >= 160 || angle < -150) return 'Square Leg';
    if (angle >= -150 && angle < -110) return 'Mid Wicket';
    if (angle >= -110 && angle < -75) return 'Mid On';
    if (angle >= -75 && angle < -45) return 'Mid Off';
    return 'Cover';
  };

  // --- Official Cricket Rule Validation Checks ---
  const validateFieldingRules = () => {
    let errors = [];

    // 1. Outside 30-Yard Circle Count (Radius = 90px from center 200,200)
    let outside30Yard = 0;
    // 2. Leg Side Count (x < 200)
    let legSideCount = 0;
    // 3. Behind Square Leg on Leg Side (x < 200, y > 235) - Law 28.4
    let deepBehindSquareLeg = 0;

    fielders.forEach((f) => {
      if (f.id === 'f1' || f.id === 'f11') return; // Ignore Keeper & Bowler for 30-yard count

      const dist = Math.hypot(f.x - 200, f.y - 200);
      if (dist > 90) outside30Yard++;

      if (f.x < 200) legSideCount++;

      if (f.x < 200 && f.y > 235) deepBehindSquareLeg++;
    });

    const maxOutside = isPowerplay ? 2 : 5;
    if (outside30Yard > maxOutside) {
      errors.push(`Powerplay Rule: Max ${maxOutside} fielders allowed outside 30-yard circle (Current: ${outside30Yard})`);
    }

    if (legSideCount > 5) {
      errors.push(`Law 28.4: Max 5 fielders allowed on Leg Side (Current: ${legSideCount})`);
    }

    if (deepBehindSquareLeg > 2) {
      errors.push(`Law 28.4: Max 2 fielders allowed behind Square Leg on Leg Side (Current: ${deepBehindSquareLeg})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      outside30Yard,
      legSideCount,
      deepBehindSquareLeg
    };
  };

  const ruleStatus = validateFieldingRules();

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-base">MCC Rules Draggable Wagon Wheel</h3>
            <p className="text-[11px] text-slate-400">Bowler &amp; Keeper fixed • Official fielding laws enforced</p>
          </div>
        </div>

        {/* Selected Zone Badge */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Target Zone:</span>
          <span className="font-black text-[#00D26A]">{shotMarker.zone}</span>
        </div>
      </div>

      {/* Live Cricket Law Rule Validation Status Banner */}
      <div className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
        ruleStatus.isValid
          ? 'bg-[#00D26A]/10 border-[#00D26A]/40 text-[#00D26A]'
          : 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
      }`}>
        <div className="flex items-center space-x-2">
          {ruleStatus.isValid ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>
            {ruleStatus.isValid
              ? `✅ Legal Field Setup (${isPowerplay ? 'Powerplay 1-6 Overs' : 'Non-Powerplay'} • ${ruleStatus.outside30Yard} Outside 30-Yd • ${ruleStatus.legSideCount}/5 Leg Side)`
              : ruleStatus.errors[0]}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPowerplay(!isPowerplay)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-extrabold text-slate-300 hover:text-white uppercase"
        >
          {isPowerplay ? '⚡ Mode: Powerplay (Max 2)' : '🛡️ Mode: Normal (Max 5)'}
        </button>
      </div>

      {/* SVG Interactive Field */}
      <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-slate-950 p-2 border border-slate-800 select-none shadow-2xl">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className="w-full h-full cursor-crosshair touch-none"
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Outfield Grass */}
          <circle cx="200" cy="200" r="190" fill="#0A2619" stroke="#00D26A" strokeWidth="3" />

          {/* 30-Yard Circle (Highlight Red if rule violated) */}
          <circle
            cx="200"
            cy="200"
            r="90"
            fill="none"
            stroke={ruleStatus.outside30Yard > (isPowerplay ? 2 : 5) ? "#FF3366" : "rgba(255,255,255,0.4)"}
            strokeWidth={ruleStatus.outside30Yard > (isPowerplay ? 2 : 5) ? "3" : "1.5"}
            strokeDasharray="6 4"
          />

          {/* Pitch Rect */}
          <rect x="188" y="150" width="24" height="100" fill="#D2B48C" rx="2" opacity="0.9" />
          <line x1="184" y1="165" x2="216" y2="165" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="184" y1="235" x2="216" y2="235" stroke="#FFFFFF" strokeWidth="2" />

          {/* Sector Labels */}
          <text x="320" y="100" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">COVER</text>
          <text x="330" y="205" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">POINT</text>
          <text x="290" y="320" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">THIRD MAN</text>
          <text x="70" y="320" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">FINE LEG</text>
          <text x="40" y="205" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">SQ LEG</text>
          <text x="50" y="100" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID WICKET</text>
          <text x="140" y="45" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID ON</text>
          <text x="230" y="45" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID OFF</text>

          {/* Shot Vector Line */}
          <line
            x1="200"
            y1="235"
            x2={shotMarker.x}
            y2={shotMarker.y}
            stroke="#00D26A"
            strokeWidth="3"
            strokeDasharray="4 2"
          />

          {/* Shot Target Marker */}
          <g
            transform={`translate(${shotMarker.x}, ${shotMarker.y})`}
            onMouseDown={(e) => handlePointerDown('shot_marker', false, e)}
            onTouchStart={(e) => handlePointerDown('shot_marker', false, e)}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle r="12" fill="#00D26A" fillOpacity="0.3" stroke="#00D26A" strokeWidth="2" />
            <circle r="5" fill="#00D26A" />
          </g>

          {/* 11 Fielders */}
          {fielders.map((f) => {
            const isOutside = Math.hypot(f.x - 200, f.y - 200) > 90;
            return (
              <g
                key={f.id}
                transform={`translate(${f.x}, ${f.y})`}
                onMouseDown={(e) => handlePointerDown(f.id, f.isFixed, e)}
                onTouchStart={(e) => handlePointerDown(f.id, f.isFixed, e)}
                className={f.isFixed ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"}
              >
                <circle
                  r="10"
                  fill={f.isFixed ? "#0066FF" : (isOutside ? "#FF9900" : "#FF3366")}
                  stroke={f.isFixed ? "#66B2FF" : "#FFFFFF"}
                  strokeWidth="2"
                />
                {f.isFixed && (
                  <circle r="3" fill="#FFFFFF" />
                )}
                <text y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" pointerEvents="none">
                  {f.name.charAt(0)}
                </text>
                <text y="-13" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontWeight="bold" pointerEvents="none">
                  {f.name} {f.isFixed ? "🔒" : ""}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 px-3 py-1.5 rounded-xl text-center text-[10px] font-semibold text-slate-300 flex items-center justify-around">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></span> 🔒 Bowler/Keeper (Fixed)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF3366]"></span> Inside 30-Yd</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]"></span> Outside 30-Yd</span>
        </div>
      </div>

    </div>
  );
}
