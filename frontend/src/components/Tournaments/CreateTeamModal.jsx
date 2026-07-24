import React, { useState } from 'react';
import { X, Shield, PlusCircle, Check } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function CreateTeamModal({ isOpen, onClose }) {
  const { teams } = useCricket();
  const [teamName, setTeamName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoEmoji, setLogoEmoji] = useState('⚡');
  const [teamColor, setTeamColor] = useState('#00D26A');

  if (!isOpen) return null;

  const emojis = ['🔥', '⚡', '💥', '🦁', '🦅', '👑', '🚀', '🐅', '⚔️', '🛡️'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !shortName) return;

    const newTeamId = `t_${Date.now()}`;
    teams[newTeamId] = {
      id: newTeamId,
      name: teamName,
      short_name: shortName.toUpperCase(),
      logo: logoEmoji,
      color: teamColor
    };

    alert(`Team ${teamName} (${shortName}) created successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#121824] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Register Custom Team</h3>
              <p className="text-xs text-slate-400">Add custom squad logo, short name &amp; theme</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Team Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pune Panthers"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Short Name (3-4 Letters)</label>
            <input
              type="text"
              required
              maxLength={4}
              placeholder="PUN"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-bold uppercase focus:outline-none focus:border-[#00D26A]"
            />
          </div>

          {/* Logo Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Select Squad Insignia Logo</label>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setLogoEmoji(emoji)}
                  className={`py-2 rounded-xl text-xl transition border ${
                    logoEmoji === emoji
                      ? 'bg-[#00D26A]/20 border-[#00D26A] scale-110'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
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
              className="flex-1 py-3 rounded-xl bg-[#00D26A] hover:bg-[#00FF95] text-black font-extrabold text-sm shadow-lg shadow-[#00D26A]/20"
            >
              Register Team
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
