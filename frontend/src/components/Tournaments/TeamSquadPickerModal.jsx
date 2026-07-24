import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Users, Check, AlertCircle, Shield } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function TeamSquadPickerModal({ isOpen, onClose, teamId = 't1' }) {
  const { players, teams, setPlayers } = useCricket();
  const playerList = Object.values(players);
  const team = teams[teamId] || { name: "Mumbai Strikers", logo: "🔥" };

  // Filter players already assigned to other teams in this tournament
  const [selectedPlayerIds, setSelectedPlayerIds] = useState(
    playerList.filter(p => p.team_id === teamId).map(p => p.id)
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const togglePlayer = (p) => {
    setErrorMsg('');
    // Single-Team Restriction Check:
    if (p.team_id && p.team_id !== teamId) {
      const otherTeam = teams[p.team_id] || { name: "another team" };
      setErrorMsg(`Single-Team Restriction: Player ${p.name} is already registered with ${otherTeam.name} in this tournament!`);
      return;
    }

    if (selectedPlayerIds.includes(p.id)) {
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== p.id));
    } else {
      setSelectedPlayerIds((prev) => [...prev, p.id]);
    }
  };

  const handleSaveSquad = (e) => {
    e.preventDefault();
    // Save updated player team assignments
    const updatedPlayers = { ...players };
    Object.keys(updatedPlayers).forEach((id) => {
      if (selectedPlayerIds.includes(id)) {
        updatedPlayers[id].team_id = teamId;
      } else if (updatedPlayers[id].team_id === teamId) {
        updatedPlayers[id].team_id = null; // Unassign if removed
      }
    });

    setPlayers(updatedPlayers);
    alert(`Squad for ${team.name} updated successfully (${selectedPlayerIds.length} Players)!`);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md my-auto bg-[#121824] border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative z-[1000000]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#121824] z-10 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Draft Squad: {team.logo} {team.name}</h3>
              <p className="text-xs text-slate-400">Team Admin Player Picker • Single-Team Limit Enforced</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveSquad} className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase">Select Registered Players ({selectedPlayerIds.length} Selected)</label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {playerList.map((p) => {
              const isSelected = selectedPlayerIds.includes(p.id);
              const isOtherTeam = p.team_id && p.team_id !== teamId;
              const otherTeam = teams[p.team_id] || { name: "Other Team" };

              return (
                <div
                  key={p.id}
                  onClick={() => togglePlayer(p)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-400 text-white'
                      : isOtherTeam
                      ? 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {p.role} {isOtherTeam ? `• Signed with ${otherTeam.name}` : ''}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20"
            >
              Save Team Squad
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
