import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, Phone, Calendar, AlertCircle, ArrowRight, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function LoginPage() {
  const { handleLogin, handleRegister, currentUser, handleLogout, setActiveTab } = useCricket();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!email.toLowerCase().includes('@gmail.com') && !email.toLowerCase().includes('@')) {
          throw new Error("Please enter a valid Gmail address (e.g. user@gmail.com)");
        }
        if (phoneNumber.length < 10) {
          throw new Error("Please enter a valid 10-digit mobile phone number");
        }
        if (parseInt(age) < 10 || parseInt(age) > 90) {
          throw new Error("Please enter a valid age between 10 and 90");
        }

        await handleRegister({
          name,
          email,
          phone_number: phoneNumber,
          age: parseInt(age),
          password
        });
      } else {
        await handleLogin(email, password);
      }
      setActiveTab('match_center');
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (userType) => {
    setLoading(true);
    try {
      if (userType === 'USER1') {
        await handleLogin('scorer@gmail.com', 'scorer123');
      } else {
        await handleLogin('organizer@gmail.com', 'organizer123');
      }
      setActiveTab('match_center');
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 pb-20 space-y-6">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-bold">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase text-[#00D26A] tracking-wider block">AUTHENTICATED MEMBER</span>
            <h2 className="text-2xl font-heading font-black text-white mt-1">{currentUser.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{currentUser.email} • {currentUser.phone_number || "+91 9876543210"} • Age: {currentUser.age || 26}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <p className="text-slate-400 font-semibold">
              Create a tournament to become its <strong>Organizer</strong>, or get appointed as <strong>Official Match Scorer</strong>!
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setActiveTab('match_center')}
              className="flex-1 py-3.5 rounded-xl bg-[#00D26A] text-black font-extrabold text-xs shadow-lg shadow-[#00D26A]/20 hover:bg-[#00FF95] transition"
            >
              Enter Match Center
            </button>
            <button
              onClick={handleLogout}
              className="py-3.5 px-5 rounded-xl bg-slate-800 text-red-400 hover:bg-slate-700 font-extrabold text-xs transition border border-slate-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6 pb-20 space-y-5">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black shadow-lg shadow-[#00D26A]/20 mb-1">
          <Flame className="w-7 h-7 font-black" />
        </div>
        <h2 className="text-2xl font-heading font-black text-white">CricHeroes Account Access</h2>
        <p className="text-xs text-slate-400">Database Connected Grassroots Authentication</p>
      </div>

      {/* Auth Card */}
      <div className="glass-card rounded-3xl p-7 border border-slate-800 space-y-5 shadow-2xl">
        
        {/* Toggle Mode */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setIsRegisterMode(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              !isRegisterMode ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegisterMode(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              isRegisterMode ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Varma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Age</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    required
                    min="10"
                    max="90"
                    placeholder="e.g. 24"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Gmail Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="rohit.varma@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D26A] to-[#00FF95] text-black font-heading font-extrabold text-sm shadow-lg shadow-[#00D26A]/20 hover:opacity-95 transition flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? "Connecting Database..." : (isRegisterMode ? "Register & Connect Profile" : "Sign In to CricHeroes")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Or Click to Sign In as Verified Account
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('USER1')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <span>👤 Rohit (Age 26)</span>
            </button>
            <button
              onClick={() => handleDemoLogin('USER2')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <span>👤 Amit (Age 32)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
