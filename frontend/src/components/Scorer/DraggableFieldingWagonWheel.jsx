import React, { useState, useRef } from 'react';
import { Target, Shield, Move, RotateCcw, Check, Compass } from 'lucide-react';

const INITIAL_FIELDERS = [
  { id: 'f1', name: 'Wicket Keeper', zone: 'Keeper', x: 200, y: 310 },
  { id: 'f2', name: '1st Slip', zone: 'Slips', x: 230, y: 320 },
  { id: 'f3', name: 'Point', zone: 'Point', x: 310, y: 200 },
  { id: 'f4', name: 'Cover', zone: 'Cover', x: 290, y: 130 },
  { id: 'f5', name: 'Mid Off', zone: 'Mid Off', x: 230, y: 100 },
  { id: 'f6', name: 'Mid On', zone: 'Mid On', x: 170, y: 100 },
  { id: 'f7', name: 'Mid Wicket', zone: 'Mid Wicket', x: 110, y: 140 },
  { id: 'f8', name: 'Square Leg', zone: 'Square Leg', x: 90, y: 200 },
  { id: 'f9', name: 'Fine Leg', zone: 'Fine Leg', x: 120, y: 320 },
  { id: 'f10', name: 'Third Man', zone: 'Third Man', x: 300, y: 330 },
  { id: 'f11', name: 'Bowler', zone: 'Bowler', x: 200, y: 150 }
];

export default function DraggableFieldingWagonWheel({ onZoneSelect, selectedZone = "Cover" }) {
  const [fielders, setFielders] = useState(INITIAL_FIELDERS);
  const [draggingId, setDraggingId] = useState(null);
  const [shotMarker, setShotMarker] = useState({ x: 280, y: 120, zone: selectedZone });
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

  const handlePointerDown = (id, e) => {
    e.stopPropagation();
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
        prev.map((f) => (f.id === draggingId ? { ...f, x, y, zone: determineZone(x, y) } : f))
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const handleSvgClick = (e) => {
    if (draggingId) return;
    const { x, y } = getSVGCoords(e);
    const zone = determineZone(x, y);
    setShotMarker({ x, y, zone });
    if (onZoneSelect) onZoneSelect(zone);
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

  const applyPreset = (preset) => {
    if (preset === 'powerplay') {
      setFielders(INITIAL_FIELDERS);
    } else if (preset === 'boundary_defense') {
      setFielders([
        { id: 'f1', name: 'Keeper', zone: 'Keeper', x: 200, y: 300 },
        { id: 'f2', name: 'Deep Cover', zone: 'Cover', x: 350, y: 80 },
        { id: 'f3', name: 'Deep Point', zone: 'Point', x: 360, y: 200 },
        { id: 'f4', name: 'Deep Mid Off', zone: 'Mid Off', x: 280, y: 40 },
        { id: 'f5', name: 'Long On', zone: 'Mid On', x: 120, y: 40 },
        { id: 'f6', name: 'Deep Mid Wicket', zone: 'Mid Wicket', x: 40, y: 120 },
        { id: 'f7', name: 'Deep Sq Leg', zone: 'Square Leg', x: 40, y: 220 },
        { id: 'f8', name: 'Deep Fine Leg', zone: 'Fine Leg', x: 80, y: 350 },
        { id: 'f9', name: 'Deep Third Man', zone: 'Third Man', x: 330, y: 350 },
        { id: 'f10', name: 'Extra Cover', zone: 'Cover', x: 310, y: 140 },
        { id: 'f11', name: 'Bowler', zone: 'Bowler', x: 200, y: 150 }
      ]);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-base">Draggable Wagon Wheel &amp; Field Planner</h3>
            <p className="text-[11px] text-slate-400">Drag fielders or shot target anywhere on the field</p>
          </div>
        </div>

        {/* Selected Zone Badge */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Selected Zone:</span>
          <span className="text-xs font-black text-[#00D26A]">{shotMarker.zone}</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold text-[11px] uppercase mr-1">Field Presets:</span>
        <button
          type="button"
          onClick={() => applyPreset('powerplay')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 whitespace-nowrap"
        >
          ⚡ Powerplay 30-Yard
        </button>
        <button
          type="button"
          onClick={() => applyPreset('boundary_defense')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 whitespace-nowrap"
        >
          🛡️ Boundary Defense
        </button>
        <button
          type="button"
          onClick={() => setFielders(INITIAL_FIELDERS)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
          title="Reset Fielders"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Interactive Field */}
      <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-slate-950 p-2 border border-slate-800 select-none shadow-2xl">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className="w-full h-full cursor-crosshair touch-none"
          onClick={handleSvgClick}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Ground Outfield (Grass Gradient) */}
          <circle cx="200" cy="200" r="190" fill="#0A2619" stroke="#00D26A" strokeWidth="3" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#00D26A" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />

          {/* 30 Yard Circle */}
          <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

          {/* Pitch Rect */}
          <rect x="188" y="150" width="24" height="100" fill="#D2B48C" rx="2" opacity="0.9" />

          {/* Crease Lines & Stumps */}
          <line x1="184" y1="165" x2="216" y2="165" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="184" y1="235" x2="216" y2="235" stroke="#FFFFFF" strokeWidth="2" />

          {/* Zone Sector Labels */}
          <text x="320" y="100" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">COVER</text>
          <text x="330" y="205" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">POINT</text>
          <text x="290" y="320" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">THIRD MAN</text>
          <text x="70" y="320" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">FINE LEG</text>
          <text x="40" y="205" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">SQ LEG</text>
          <text x="50" y="100" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID WICKET</text>
          <text x="140" y="45" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID ON</text>
          <text x="230" y="45" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold">MID OFF</text>

          {/* Shot Wagon Trajectory Vector from Pitch to Shot Marker */}
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
            onMouseDown={(e) => handlePointerDown('shot_marker', e)}
            onTouchStart={(e) => handlePointerDown('shot_marker', e)}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle r="12" fill="#00D26A" fillOpacity="0.3" stroke="#00D26A" strokeWidth="2" />
            <circle r="5" fill="#00D26A" />
          </g>

          {/* 11 Draggable Fielders */}
          {fielders.map((f) => (
            <g
              key={f.id}
              transform={`translate(${f.x}, ${f.y})`}
              onMouseDown={(e) => handlePointerDown(f.id, e)}
              onTouchStart={(e) => handlePointerDown(f.id, e)}
              className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            >
              <circle r="10" fill="#FF3366" stroke="#FFFFFF" strokeWidth="1.5" className="shadow-lg" />
              <text y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" pointerEvents="none">
                {f.name.charAt(0)}
              </text>
              <text y="-13" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontWeight="bold" pointerEvents="none">
                {f.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Dynamic Drag Hint Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-center text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-2">
          <Move className="w-3.5 h-3.5 text-[#00D26A]" />
          <span>Click or drag any red fielder / green shot marker to update zone</span>
        </div>
      </div>

    </div>
  );
}
