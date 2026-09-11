import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Phone, X, Eye, EyeOff } from 'lucide-react';

// =========================================================================
// REPLACE THESE IMAGE PATHS WITH YOUR ACTUAL ASSET FILE PATHS
// =========================================================================
import logoImg from './frame.png'; // Your SuperKrishak logo image
import heroBgImg from './farm-illustration.jpg'; // Your farm/tractor landscape image (Optional)

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@superkrishak');
  const [password, setPassword] = useState('superkrishak');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="fixed inset-0 w-full h-full flex bg-white overflow-hidden">
      
      {/* LEFT PANEL: Farm Landscape Illustration */}
      <div className="hidden md:flex md:w-[60%] lg:w-[65%] h-full relative bg-gradient-to-br from-amber-200 via-orange-300 to-teal-700 overflow-hidden">
        {heroBgImg ? (
          <img 
            src={heroBgImg} 
            alt="Super Krishak Farming Background" 
            className="w-full h-full object-cover object-center"
          />
        ) : (
          /* Fallback Gradient Graphic if heroBgImg isn't loaded yet */
          <div className="w-full h-full flex flex-col justify-end p-12 bg-gradient-to-t from-teal-900/80 via-transparent to-transparent text-white">
            <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">SuperKrishak</h1>
            <p className="text-lg opacity-90 font-medium">Smart Farm Monitoring & Analytics Platform</p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Login Form Area */}
      <div className="w-full md:w-[40%] lg:w-[35%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto">
        
        {/* Top Blank Spacer for vertical balance */}
        <div className="hidden sm:block h-4"></div>

        {/* Main Content Box */}
        <div className="w-full max-w-sm mx-auto my-auto">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            {logoImg ? (
              <img 
                src={logoImg} 
                alt="Super Krishak Logo" 
                className="h-28 sm:h-32 w-auto object-contain mb-2 transition-transform hover:scale-105" 
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg mx-auto mb-2">
                  SK
                </div>
                <h2 className="text-2xl font-black text-gray-800">Super Krishak</h2>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl mb-5 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="text-red-500 mr-1">*</span>Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-50/40 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-sm text-gray-800 font-medium placeholder-gray-400"
                  placeholder="admin@superkrishak.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="text-red-500 mr-1">*</span>Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-blue-50/40 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-sm text-gray-800 font-medium placeholder-gray-400"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#58c072] hover:bg-[#2cb84f] text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 text-sm mt-2"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Demo Quick Select</p>
            <div className="flex flex-col gap-1.5">
              {[
                ['Admin', 'admin@superkrishak'],
                ['Organization', 'org@superkrishak'],
                ['Sub-Org', 'suborg@superkrishak']
              ].map(([role, demoEmail]) => (
                <button
                  key={demoEmail}
                  type="button"
                  onClick={() => handleQuickLogin(demoEmail)}
                  className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/60 px-3 py-1.5 text-xs hover:border-blue-300 hover:bg-blue-50/50 transition text-left"
                >
                  <span className="font-semibold text-gray-700">{role}</span>
                  <span className="font-mono text-gray-400 text-[11px]">{demoEmail}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer Links */}
        <div className="pt-6 text-center text-[11px] text-gray-400 flex justify-center gap-4">
          <a href="#terms" className="hover:text-gray-600 transition">Terms & Conditions</a>
          <span>•</span>
          <a href="#privacy" className="hover:text-gray-600 transition">Privacy Policy</a>
        </div>
      </div>

      {/* Access Recovery Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative border border-gray-100">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">Access Recovery Request</h3>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              Please contact your system administrator at <br />
              <span className="font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg mt-2 inline-block text-sm">
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