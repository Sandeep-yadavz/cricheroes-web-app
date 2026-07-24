import React, { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function WormChart() {
  const { match } = useCricket();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Simulated Innings 1 Cumulative Run Curve
    const oversLimit = match.overs_limit || 20;
    const totalRuns = match.innings_1.runs;
    const currOvers = match.innings_1.overs;

    const points = [];
    const stepX = (width - 60) / oversLimit;
    const maxVal = Math.max(totalRuns, 180);

    let cum = 0;
    for (let i = 0; i <= Math.floor(currOvers); i++) {
      cum += Math.round((totalRuns / Math.max(currOvers, 1)) + (Math.sin(i) * 3));
      const x = 40 + i * stepX;
      const y = height - 30 - (Math.min(cum, totalRuns) / maxVal) * (height - 60);
      points.push({ x, y });
    }

    // Draw Gradient Line for Innings 1
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = '#00D26A';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00D26A';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw Point Dots
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00D26A';
      ctx.fill();
    });

  }, [match]);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#00D26A]" />
          <h3 className="font-heading font-extrabold text-white text-lg">Innings Worm Graph</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Run Rate Progression</span>
      </div>

      <div className="relative w-full overflow-hidden flex justify-center">
        <canvas ref={canvasRef} width={600} height={260} className="w-full max-w-2xl bg-slate-900/60 rounded-xl border border-slate-800/80" />
      </div>

      <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-1">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#00D26A]"></span>
          <span className="text-white">Innings 1 (Mumbai Strikers)</span>
        </div>
        <div className="flex items-center space-x-2 opacity-50">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-slate-400">Innings 2 (Delhi Dynamites)</span>
        </div>
      </div>
    </div>
  );
}
