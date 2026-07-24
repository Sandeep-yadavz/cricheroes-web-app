import React, { useState, useRef, useEffect } from 'react';
import { Compass, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const DEFAULT_FIELDERS = [
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

export default function DraggableFieldingWagonWheel({ onZoneSelect, isEditable = false }) {
  const { match, handleUpdateFieldingPositions } = useCricket();

  const fielders = match.fielding_positions || DEFAULT_FIELDERS;

  const [draggingId, setDraggingId] = useState(null);
  const [selectedZone, setSelectedZone] = useState('Cover');
  const [isPowerplay, setIsPowerplay] = useState(true);
  const svgRef = useRef(null);

  const getSVGCoords = (clientX, clientY) => {
    if (!svgRef.current) return { x: 200, y: 200 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((clientX - rect.left) / rect.width) * 400);
    const y = Math.round(((clientY - rect.top) / rect.height) * 400);
    return { x: Math.max(15, Math.min(385, x)), y: Math.max(15, Math.min(385, y)) };
  };

  const handleStartDrag = (id, isFixed, e) => {
    if (!isEditable || isFixed) return;
    e.preventDefault();
    setDraggingId(id);
  };

  useEffect(() => {
    const handleWindowMove = (e) => {
      if (!draggingId || !isEditable) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const { x, y } = getSVGCoords(clientX, clientY);
      const zone = determineZone(x, y);

      const updatedFielders = fielders.map((f) => {
        if (f.id === draggingId && !f.isFixed) {
          return { ...f, x, y, zone };
        }
        return f;
      });

      handleUpdateFieldingPositions(updatedFielders);
      setSelectedZone(zone);
      if (onZoneSelect) onZoneSelect(zone);
    };

    const handleWindowEnd = () => {
      setDraggingId(null);
    };

    if (draggingId && isEditable) {
      window.addEventListener('mousemove', handleWindowMove);
      window.addEventListener('mouseup', handleWindowEnd);
      window.addEventListener('touchmove', handleWindowMove);
      window.addEventListener('touchend', handleWindowEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowEnd);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('touchend', handleWindowEnd);
    };
  }, [draggingId, isEditable, fielders]);

  const handleFieldClick = (e) => {
    if (!isEditable || draggingId) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const { x, y } = getSVGCoords(clientX, clientY);
    const zone = determineZone(x, y);

    let minDistance = Infinity;
    let targetFielder = null;

    fielders.forEach((f) => {
      if (!f.isFixed) {
        const d = Math.hypot(f.x - x, f.y - y);
        if (d < minDistance) {
          minDistance = d;
          targetFielder = f;
        }
      }
    });

    if (targetFielder) {
      const updatedFielders = fielders.map((f) => (f.id === targetFielder.id ? { ...f, x, y, zone } : f));
      handleUpdateFieldingPositions(updatedFielders);
      setSelectedZone(zone);
      if (onZoneSelect) onZoneSelect(zone);
    }
  };

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

  // Comprehensive Both-Sides Fielding Law Validations (Leg Side & Off Side)
  const validateFieldingRules = () => {
    let errors = [];
    let outside30Yard = 0;
    let legSideCount = 0;
    let offSideCount = 0;
    let behindSquareLegCount = 0;

    fielders.forEach((f) => {
      if (f.id === 'f1' || f.id === 'f11') return; // Exclude bowler and keeper
      const dist = Math.hypot(f.x - 200, f.y - 200);
      if (dist > 90) outside30Yard++;

      if (f.x < 200) {
        legSideCount++;
        if (f.y > 200) behindSquareLegCount++;
      } else {
        offSideCount++;
      }
    });

    const maxOutside = isPowerplay ? 2 : 5;
    if (outside30Yard > maxOutside) {
      errors.push(`Powerplay: Max ${maxOutside} fielders outside 30-yard circle (Current: ${outside30Yard})`);
    }

    if (legSideCount > 5) {
      errors.push(`Law 28.4: Max 5 fielders allowed on Leg Side (Current: ${legSideCount})`);
    }

    if (offSideCount > 7) {
      errors.push(`Off Side Limit: Max 7 fielders allowed on Off Side (Current: ${offSideCount})`);
    }

    if (behindSquareLegCount > 2) {
      errors.push(`Law 28.4: Max 2 fielders behind Square Leg (Current: ${behindSquareLegCount})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      outside30Yard,
      legSideCount,
      offSideCount,
      behindSquareLegCount
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
            <h3 className="font-heading font-extrabold text-white text-base">Dual-Side Field Placement Console</h3>
            <p className="text-[11px] text-slate-400">
              {isEditable ? '🛡️ Live Syncing • Validating Off Side &amp; Leg Side Laws' : '👁️ Live Spectator View • Both Sides Field Status Synced'}
            </p>
          </div>
        </div>

        {/* Active Mode Badge */}
        <div className="flex items-center space-x-2">
          {isEditable ? (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 flex items-center gap-1 animate-pulse">
              <CheckCircle className="w-3 h-3" /> Scorer Editable
            </span>
          ) : (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Synced Read-Only
            </span>
          )}
        </div>
      </div>

      {/* Live Cricket Law Rule Validation Banner for BOTH Sides */}
      <div className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
        ruleStatus.isValid
          ? 'bg-[#00D26A]/10 border-[#00D26A]/40 text-[#00D26A]'
          : 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
      }`}>
        <div className="flex items-center space-x-2">
          {ruleStatus.isValid ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>
            {ruleStatus.isValid
              ? `✅ Legal Field (${isPowerplay ? 'Powerplay' : 'Normal'} • ${ruleStatus.offSideCount}/7 Off Side • ${ruleStatus.legSideCount}/5 Leg Side)`
              : ruleStatus.errors[0]}
          </span>
        </div>

        {isEditable && (
          <button
            type="button"
            onClick={() => setIsPowerplay(!isPowerplay)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-extrabold text-slate-300 hover:text-white uppercase"
          >
            {isPowerplay ? '⚡ Powerplay (Max 2)' : '🛡️ Normal (Max 5)'}
          </button>
        )}
      </div>

      {/* SVG Interactive Field */}
      <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-slate-950 p-2 border border-slate-800 select-none shadow-2xl">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className={`w-full h-full ${isEditable ? 'cursor-pointer touch-none' : 'cursor-default pointer-events-none'}`}
          onClick={handleFieldClick}
        >
          {/* Outfield Grass */}
          <circle cx="200" cy="200" r="190" fill="#0A2619" stroke="#00D26A" strokeWidth="3" />

          {/* 30-Yard Circle */}
          <circle
            cx="200"
            cy="200"
            r="90"
            fill="none"
            stroke={ruleStatus.outside30Yard > (isPowerplay ? 2 : 5) ? "#FF3366" : "rgba(255,255,255,0.4)"}
            strokeWidth={ruleStatus.outside30Yard > (isPowerplay ? 2 : 5) ? "3" : "1.5"}
            strokeDasharray="6 4"
          />

          {/* Center Dividing Line separating Off Side and Leg Side */}
          <line x1="200" y1="10" x2="200" y2="390" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Pitch Rect */}
          <rect x="188" y="150" width="24" height="100" fill="#D2B48C" rx="2" opacity="0.9" />
          <line x1="184" y1="165" x2="216" y2="165" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="184" y1="235" x2="216" y2="235" stroke="#FFFFFF" strokeWidth="2" />

          {/* Sector Labels */}
          <text x="320" y="100" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">COVER</text>
          <text x="330" y="205" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">POINT</text>
          <text x="290" y="320" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">THIRD MAN</text>
          <text x="70" y="320" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">FINE LEG</text>
          <text x="40" y="205" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">SQ LEG</text>
          <text x="50" y="100" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">MID WICKET</text>
          <text x="140" y="45" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">MID ON</text>
          <text x="230" y="45" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="bold" pointerEvents="none">MID OFF</text>

          {/* 11 Fielders */}
          {fielders.map((f) => {
            const isOutside = Math.hypot(f.x - 200, f.y - 200) > 90;
            const isBeingDragged = draggingId === f.id;

            return (
              <g
                key={f.id}
                transform={`translate(${f.x}, ${f.y})`}
                onMouseDown={(e) => handleStartDrag(f.id, f.isFixed, e)}
                onTouchStart={(e) => handleStartDrag(f.id, f.isFixed, e)}
                className={!isEditable || f.isFixed ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
              >
                <circle r="22" fill="transparent" />

                {isBeingDragged && (
                  <circle r="16" fill="none" stroke="#00D26A" strokeWidth="2.5" className="animate-ping" />
                )}

                <circle
                  r={isBeingDragged ? "13" : "11"}
                  fill={f.isFixed ? "#0066FF" : (isOutside ? "#FF9900" : "#FF3366")}
                  stroke={f.isFixed ? "#66B2FF" : (isBeingDragged ? "#00D26A" : "#FFFFFF")}
                  strokeWidth="2.5"
                  className="shadow-xl transition-all"
                />

                <text y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" pointerEvents="none">
                  {f.name.charAt(0)}
                </text>
                <text y="-14" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="extrabold" pointerEvents="none">
                  {f.name} {f.isFixed ? "🔒" : ""}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 px-3 py-1.5 rounded-xl text-center text-[10px] font-semibold text-slate-300 flex items-center justify-around">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></span> 🔒 Bowler/Keeper</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF3366]"></span> Inside 30-Yd</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]"></span> Outside 30-Yd</span>
        </div>
      </div>

    </div>
  );
}
