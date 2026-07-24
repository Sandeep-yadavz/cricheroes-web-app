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
        // Strict Gmail Address Validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(email.trim())) {
          throw new Error("Invalid Gmail Address! Email must be a valid @gmail.com address (e.g. user@gmail.com)");
        }

        // Strict 10-Digit Mobile Phone Number Validation
        const phoneClean = phoneNumber.replace(/\D/g, '');
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneClean)) {
          throw new Error("Invalid Mobile Number! Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
        }

        // Age Validation
        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 90) {
          throw new Error("Invalid Age! Please enter a valid age between 10 and 90 years.");
        }

        await handleRegister({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phoneClean,
          age: parsedAge,
          password
        });
      } else {
        await handleLogin(email.trim(), password);
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
            <p className="text-xs text-slate-400 mt-1">{currentUser.email} • {currentUser.phone_number || "9876543210"} • Age: {currentUser.age || 26}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <p className="text-slate-400 font-semibold">
              Search nearby live matches, tournaments, teams &amp; players on the discovery hub!
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setActiveTab('search')}
              className="flex-1 py-3.5 rounded-xl bg-[#00D26A] text-black font-extrabold text-xs shadow-lg shadow-[#00D26A]/20 hover:bg-[#00FF95] transition"
            >
              Discover Nearby Matches
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
        <h2 className="text-2xl font-heading font-black text-white">CricHeroes Member Sign In</h2>
        <p className="text-xs text-slate-400">Validated Gmail &amp; Phone Number Registration</p>
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
            Register Profile
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
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
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">10-Digit Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="e.g. 9876543210"
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
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Gmail Address (@gmail.com)</label>
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
            <span>{loading ? "Validating & Registering..." : (isRegisterMode ? "Register & Create Profile" : "Sign In")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Or Click to Sign In as Verified Profile
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
