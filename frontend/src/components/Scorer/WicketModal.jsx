import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function WicketModal() {
  const { isWicketModalOpen, setIsWicketModalOpen, handleScoreBall } = useCricket();
  const [wicketType, setWicketType] = useState('Caught');
  const [fielderName, setFielderName] = useState('');

  if (!isWicketModalOpen) return null;

  const wicketTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'];

  const handleSubmit = (e) => {
    e.preventDefault();
    handleScoreBall({
      runs: 0,
      is_wicket: true,
      wicket_type: wicketType,
      fielder_name: fielderName,
      shot_zone: 'Cover'
    });
    setIsWicketModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Record Wicket</h3>
              <p className="text-xs text-slate-400">Select dismissal details for the striker</p>
            </div>
          </div>
          <button
            onClick={() => setIsWicketModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dismissal Mode Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Dismissal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {wicketTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWicketType(type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    wicketType === type
                      ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Fielder Input if Caught / Run Out / Stumped */}
          {(wicketType === 'Caught' || wicketType === 'Run Out' || wicketType === 'Stumped') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Fielder Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rishabh Singh"
                value={fielderName}
                onChange={(e) => setFielderName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWicketModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition"
            >
              Confirm Wicket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
