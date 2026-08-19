import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Phone, X } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@superkrishak');
  const [password, setPassword] = useState('superkrishak');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('superkrishak');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-[#1F2937] z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'radial-gradient(#2DA86E 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl p-8 relative z-10 animate-fadeIn">
        {/* Top gradient banner */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-green rounded-t-2xl"></div>

        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">
              SK
            </div>
            <div className="text-2xl font-black text-gray-900 leading-tight">
              Super<br /><span className="text-brand-green font-bold">Krishak</span>
            </div>
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-gray-700 mb-1">Farm Monitoring Platform</h2>
        <p className="text-center text-xs text-gray-500 mb-6 font-medium">Centralized Intelligence Hub</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition bg-white/70 text-sm font-medium"
                placeholder="admin@superkrishak"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition bg-white/70 text-sm font-medium"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 mt-3"
          >
            <span>Access Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-brand-blue hover:text-blue-800 font-semibold transition"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Demo accounts</p>
          <div className="grid grid-cols-1 gap-2 text-left">
            {[
              ['Admin', 'admin@superkrishak'],
              ['Organization', 'org@superkrishak'],
              ['Sub-organization', 'suborg@superkrishak']
            ].map(([role, demoEmail]) => (
              <button
                key={demoEmail}
                type="button"
                onClick={() => handleQuickLogin(demoEmail)}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/60 px-3 py-2 text-xs hover:border-brand-blue hover:bg-blue-50 transition"
              >
                <span className="font-bold text-gray-700">{role}</span>
                <span className="font-mono text-gray-500">{demoEmail}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Password for all demo accounts: <span className="font-mono">superkrishak</span></p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative border border-gray-100">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Access Recovery Request</h3>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              Please contact your system administrator at <br />
              <span className="font-bold text-brand-blue px-2.5 py-1 bg-blue-50 rounded-lg mt-1.5 inline-block text-sm">
                +977 9802300745
              </span><br />
              to verify your identity and reset your credentials.
            </p>
            <button
              onClick={() => setShowForgot(false)}
              className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-black transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
