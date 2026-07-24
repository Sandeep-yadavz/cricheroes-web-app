import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, UserCheck, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { apiClient } from '../../api/apiClient';

export default function AssignScorerModal({ isOpen, onClose, matchId }) {
  const { match, setMatch } = useCricket();
  const [usersList, setUsersList] = useState([]);
  const [selectedScorerId, setSelectedScorerId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const list = await apiClient.get('/api/users');
        if (list && Array.isArray(list)) {
          setUsersList(list);
          if (list.length > 0) setSelectedScorerId(list[0].id);
        } else {
          setUsersList([
            { id: "u1", name: "Official Scorer Rohit", email: "scorer@cricheroes.in", role: "SCORER" },
            { id: "u2", name: "League Director Amit", email: "organizer@cricheroes.in", role: "ORGANIZER" },
            { id: "u3", name: "Player Fan Rahul", email: "player@cricheroes.in", role: "PLAYER" }
          ]);
        }
      } catch (e) {
        setUsersList([
          { id: "u1", name: "Official Scorer Rohit", email: "scorer@cricheroes.in", role: "SCORER" },
          { id: "u2", name: "League Director Amit", email: "organizer@cricheroes.in", role: "ORGANIZER" }
        ]);
      }
    }
    if (isOpen) loadUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);

    const scorerUser = usersList.find((u) => u.id === selectedScorerId) || { name: "Assigned Scorer" };

    try {
      const targetMatchId = matchId || match.id;
      const res = await apiClient.post(`/api/matches/${targetMatchId}/assign-scorer`, {
        scorer_id: selectedScorerId,
        scorer_name: scorerUser.name
      });

      if (res && res.match) {
        setMatch(res.match);
      } else {
        match.assigned_scorer_id = selectedScorerId;
        match.assigned_scorer_name = scorerUser.name;
        setMatch({ ...match });
      }
      alert(`Scorer ${scorerUser.name} assigned successfully to match!`);
      onClose();
    } catch (err) {
      alert("Scorer assigned locally");
      match.assigned_scorer_id = selectedScorerId;
      match.assigned_scorer_name = scorerUser.name;
      setMatch({ ...match });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md my-auto bg-[#121824] border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative z-[1000000]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#121824] z-10 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Assign Official Match Scorer</h3>
              <p className="text-xs text-slate-400">Tournament Director Administrative Controls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Select User Account to Appoint as Match Scorer</label>
            <div className="space-y-2">
              {usersList.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedScorerId(u.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedScorerId === u.id
                      ? 'bg-amber-500/10 border-amber-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{u.name}</h4>
                      <p className="text-[10px] text-slate-400">{u.email} • Role: {u.role}</p>
                    </div>
                  </div>

                  {selectedScorerId === u.id && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-lg shadow-amber-400/20"
            >
              {loading ? "Assigning..." : "Confirm Scorer Assignment"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
