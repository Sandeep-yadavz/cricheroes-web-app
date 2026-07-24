import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Trophy, Sparkles, MapPin, Calendar, Layers } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function CreateTournamentModal({ isOpen, onClose }) {
  const { currentUser, setTournaments, setActiveTab } = useCricket();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('T20');
  const [ballType, setBallType] = useState('Leather');
  const [oversLimit, setOversLimit] = useState(20);
  const [location, setLocation] = useState('Central Cricket Ground, Mumbai');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newTour = {
      id: `tour_${Date.now()}`,
      name,
      admin_id: currentUser ? currentUser.id : "u1",
      admin_name: currentUser ? currentUser.name : "League Director",
      format,
      ball_type: ballType,
      overs_limit: parseInt(oversLimit),
      location,
      status: "Ongoing",
      teams: [],
      points_table: []
    };

    setTournaments((prev) => [newTour, ...prev]);
    alert(`Tournament "${name}" created successfully! You are the Tournament Organizer.`);
    onClose();
    setActiveTab('tournaments');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md my-auto bg-[#121824] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative z-[1000000]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#121824] z-10 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Create New Tournament</h3>
              <p className="text-xs text-slate-400">You will become the Tournament Organizer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Tournament Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Grassroots Premier League 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold"
              >
                <option value="T20">T20 (20 Overs)</option>
                <option value="T10">T10 (10 Overs)</option>
                <option value="ODI">ODI (50 Overs)</option>
                <option value="Custom">Custom Overs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Ball Type</label>
              <select
                value={ballType}
                onChange={(e) => setBallType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold"
              >
                <option value="Leather">Leather Ball</option>
                <option value="Tennis">Tennis Ball</option>
                <option value="Other">Rubber / Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Overs Limit</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((ov) => (
                <button
                  key={ov}
                  type="button"
                  onClick={() => setOversLimit(ov)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    oversLimit === ov
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {ov} Overs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Venue / Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Wankhede Stadium, Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
            />
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
              className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-lg shadow-amber-400/20"
            >
              Create Tournament
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
