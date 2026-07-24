import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ShieldAlert, UserCheck, Flame, AlertCircle, ArrowRight } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function WicketModal() {
  const { match, isWicketModalOpen, setIsWicketModalOpen, handleScoreBall, players } = useCricket();

  const [wicketType, setWicketType] = useState('Bowled');
  const [fielderName, setFielderName] = useState('Rashid Khan');
  const [runsCompleted, setRunsCompleted] = useState(0); // For Run Out: 0, 1, 2, 3
  const [outBatter, setOutBatter] = useState('striker'); // 'striker' or 'non_striker'
  const [selectedNewBatterId, setSelectedNewBatterId] = useState('p4');

  if (!isWicketModalOpen) return null;

  const currKey = `innings_${match.current_innings || 1}`;
  const inn = match[currKey] || match.innings_1 || {};
  const playerList = Object.values(players || {});

  // Remaining available batsmen from bench squad who haven't batted or been dismissed
  const activeBatterIds = [inn.striker_id, inn.non_striker_id];
  const benchBatsmen = playerList.filter(
    (p) => !activeBatterIds.includes(p.id) && !inn.batting_stats?.some((b) => b.player_id === p.id && b.out)
  );

  const handleConfirmWicket = (e) => {
    e.preventDefault();

    handleScoreBall({
      runs: wicketType === 'Run Out' ? runsCompleted : 0,
      extra_type: null,
      is_wicket: true,
      wicket_type: wicketType,
      fielder_name: fielderName,
      out_batter: outBatter,
      new_batter_id: selectedNewBatterId || benchBatsmen[0]?.id || 'p4'
    });

    setIsWicketModalOpen(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md my-auto bg-[#121824] border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative z-[1000000]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#121824] z-10 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Record Wicket &amp; New Batter</h3>
              <p className="text-xs text-slate-400">Dismissal details &amp; incoming batsman selection</p>
            </div>
          </div>
          <button onClick={() => setIsWicketModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmWicket} className="space-y-4 pt-1">
          
          {/* Wicket Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Wicket Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setWicketType(wt)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    wicketType === wt
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>

          {/* RUN OUT SPECIFIC: Runs completed before run out & Who is out? */}
          {wicketType === 'Run Out' && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-extrabold text-red-400 uppercase mb-1">
                  Who Was Run Out?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutBatter('striker')}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      outBatter === 'striker' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Striker (Rohit Varma)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutBatter('non_striker')}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      outBatter === 'non_striker' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Non-Striker (Virat Saxena)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-red-400 uppercase mb-1">
                  Runs Completed Before Run Out?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRunsCompleted(r)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        runsCompleted === r ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {r} Run{r !== 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fielder Name */}
          {(wicketType === 'Caught' || wicketType === 'Run Out' || wicketType === 'Stumped') && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Fielder Name</label>
              <input
                type="text"
                value={fielderName}
                onChange={(e) => setFielderName(e.target.value)}
                placeholder="e.g. Rashid Khan"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* SELECT INCOMING NEW BATSMAN */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-[#00D26A] uppercase mb-1.5 flex items-center justify-between">
              <span>Incoming New Batsman</span>
              <span className="text-[10px] text-slate-400">Replaces Dismissed Player</span>
            </label>

            <select
              value={selectedNewBatterId}
              onChange={(e) => setSelectedNewBatterId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:border-[#00D26A]"
            >
              {benchBatsmen.length > 0 ? (
                benchBatsmen.map((b) => (
                  <option key={b.id} value={b.id}>
                    🏏 {b.name} ({b.role})
                  </option>
                ))
              ) : (
                <option value="p4">🏏 Hardik Patel (All-Rounder)</option>
              )}
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsWicketModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center space-x-1"
            >
              <span>Confirm Wicket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
