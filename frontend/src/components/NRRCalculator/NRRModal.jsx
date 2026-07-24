import React, { useState } from 'react';
import { Calculator, ArrowRight, RefreshCw } from 'lucide-react';
import { calculateNRR } from '../../api/apiClient';

export default function NRRModal() {
  const [runsScored, setRunsScored] = useState('490');
  const [oversFaced, setOversFaced] = useState('58.4');
  const [runsConceded, setRunsConceded] = useState('450');
  const [oversBowled, setOversBowled] = useState('60.0');
  const [resultNRR, setResultNRR] = useState('+0.852');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await calculateNRR(
      parseInt(runsScored) || 0,
      parseFloat(oversFaced) || 0,
      parseInt(runsConceded) || 0,
      parseFloat(oversBowled) || 0
    );
    setResultNRR(data.net_run_rate);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] flex items-center justify-center text-black shadow-lg shadow-[#00D26A]/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">Net Run Rate (NRR) Calculator</h2>
            <p className="text-xs text-slate-400">Official tournament formula: (Runs / Overs Faced) - (Conceded / Overs Bowled)</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Runs Scored */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Total Runs Scored</label>
              <input
                type="number"
                value={runsScored}
                onChange={(e) => setRunsScored(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>

            {/* Overs Faced */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Total Overs Faced</label>
              <input
                type="text"
                value={oversFaced}
                onChange={(e) => setOversFaced(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>

            {/* Runs Conceded */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Total Runs Conceded</label>
              <input
                type="number"
                value={runsConceded}
                onChange={(e) => setRunsConceded(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>

            {/* Overs Bowled */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Total Overs Bowled</label>
              <input
                type="text"
                value={oversBowled}
                onChange={(e) => setOversBowled(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-[#00FF95] text-black font-heading font-extrabold text-sm shadow-lg shadow-[#00D26A]/20 hover:opacity-95 transition flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><span>Calculate Net Run Rate</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* NRR Output Result Display */}
        {resultNRR && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Calculated Net Run Rate (NRR)</span>
            <div className={`text-4xl font-heading font-black ${resultNRR.startsWith('+') ? 'text-[#00D26A]' : 'text-red-400'}`}>
              {resultNRR}
            </div>
            <p className="text-[11px] text-slate-500">Updated in Python FastAPI Backend Engine</p>
          </div>
        )}

      </div>

    </div>
  );
}
