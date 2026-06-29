import { useState, useEffect } from 'react';
import { ArrowRight, Check, Droplets, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { fetchAndRestoreUserData } from '../utils/userDataSync';

export default function Login() {
  const navigate = useNavigate();
  
  // UI states
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Add custom style definitions
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.cdnfonts.com/css/satoshi');
      .auth-container { font-family: 'Satoshi', sans-serif; }
      @keyframes float-shape {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .animate-float-shape { animation: float-shape 6s ease-in-out infinite; }
      .delay-2s { animation-delay: 2s; }
      .delay-4s { animation-delay: 4s; }
    `;
    document.head.appendChild(style);

    // Prefill from remember me
    const rememberedEmail = localStorage.getItem('SMART_AG_REMEMBER_EMAIL');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Prefill from Landing Page waitlist if exists
    const landingEmail = localStorage.getItem('SMART_AG_EMAIL');
    if (landingEmail) {
      setEmail(landingEmail);
      localStorage.removeItem('SMART_AG_EMAIL'); // consume it
    }

    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validation
        if (!name.trim()) throw new Error('Please enter your name.');
        if (!email.trim()) throw new Error('Please enter your email.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        // Sign Up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              display_name: name.trim()
            }
          }
        });

        if (error) throw error;

        if (data?.user) {
          // If auto-logged in or account created
          const displayName = data.user.user_metadata?.display_name || name.trim();
          localStorage.setItem('SMART_AG_USER', displayName);
          
          if (rememberMe) {
            localStorage.setItem('SMART_AG_REMEMBER_EMAIL', email.trim());
          } else {
            localStorage.removeItem('SMART_AG_REMEMBER_EMAIL');
          }

          // Trigger empty/default sync for new user
          navigate('/dashboard');
        } else {
          setErrorMsg('Registration successful! Please check your email for confirmation.');
        }

      } else {
        // Validation
        if (!email.trim()) throw new Error('Please enter your email.');
        if (!password) throw new Error('Please enter your password.');

        // Sign In with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;

        if (data?.user) {
          const displayName = data.user.user_metadata?.display_name || data.user.email.split('@')[0];
          localStorage.setItem('SMART_AG_USER', displayName);
          
          if (rememberMe) {
            localStorage.setItem('SMART_AG_REMEMBER_EMAIL', email.trim());
          } else {
            localStorage.removeItem('SMART_AG_REMEMBER_EMAIL');
          }

          // Fetch and restore database sync data
          await fetchAndRestoreUserData(data.user.id);
          
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-[100dvh] flex flex-col md:flex-row bg-[#F3F4F6] text-[#111827]">
      
      {/* Visual Branding Section (Left/Top) */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-gradient-to-br from-[#1D2A0E] to-[#6F8E2E] relative overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full max-w-lg mx-auto flex items-center justify-center scale-75 sm:scale-100">
          
          {/* Water Droplet Shape */}
          <div className="absolute animate-float-shape w-[128px] h-[160px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#E5A914]/40 shadow-2xl -ml-40 -mt-20 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Droplets className="w-10 h-10 text-white/70" />
          </div>
          
          {/* Crop Leaf Shape */}
          <div className="absolute animate-float-shape delay-2s bg-[#16A34A]/60 w-[144px] h-[176px] rounded-[40px] shadow-2xl ml-32 mt-10 flex flex-col items-center justify-center gap-2 backdrop-blur-sm border border-white/10">
            <span className="text-5xl">🌾</span>
            <div className="w-8 h-2 bg-white/40 rounded-full mt-2"></div>
          </div>
          
          {/* Sun/Weather Shape */}
          <div className="absolute animate-float-shape delay-4s bg-[#F59E0B]/50 w-[160px] h-[80px] rounded-t-full shadow-2xl top-[15%] right-[10%] flex items-end justify-center pb-4 backdrop-blur-sm border border-white/10">
             <span className="text-3xl">☀️</span>
          </div>
          
          {/* Earth/Soil Blob */}
          <div className="absolute animate-float-shape delay-2s bg-[#CA8A04]/30 w-[144px] h-[144px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl bottom-[15%] left-[5%] flex items-center justify-center backdrop-blur-sm border border-white/10">
             <span className="text-4xl">💧</span>
          </div>

          {/* Central Logo */}
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl p-1.5 animate-float-shape">
              <img src="/logo.png" alt="Kissan Alert Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <p className="font-display text-white text-3xl uppercase tracking-wide">Kissan<span className="text-[#E5A914]">Alert</span></p>
            <p className="text-white/50 text-xs mt-1 font-medium">Smart Water · Crop · Advisory</p>
          </div>

        </div>
      </div>

      {/* Authentication Form (Right/Bottom) */}
      <div className="w-full md:w-1/2 min-h-[70vh] md:min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-[448px] flex flex-col space-y-8">
          
          <div className="mb-4">
            <h1 className="text-[36px] font-bold text-[#111827] tracking-tight leading-[1.1]">
              {isSignUp ? 'Create your\nAccount' : 'Welcome back to\nKisan Alert'}
            </h1>
            <p className="text-slate-500 font-normal text-[14px] sm:text-[16px] mt-3">
              {isSignUp 
                ? 'Register now to sync your agricultural data across all devices.' 
                : 'Smart Water, Crop & Advisory System for Indian farmers.'}
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <p className="leading-relaxed font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {isSignUp && (
              <div className="relative group">
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.1em] block mb-1">
                  Full Name
                </label>
                <div className="flex items-center border-b-2 border-[#F1F5F9] focus-within:border-[#6F8E2E] transition-colors py-1">
                  <User className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-[16px] text-[#111827] py-1 outline-none placeholder-slate-300"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.1em] block mb-1">
                Email Address
              </label>
              <div className="flex items-center border-b-2 border-[#F1F5F9] focus-within:border-[#6F8E2E] transition-colors py-1">
                <Mail className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-[16px] text-[#111827] py-1 outline-none placeholder-slate-300"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.1em] block mb-1">
                Password
              </label>
              <div className="flex items-center border-b-2 border-[#F1F5F9] focus-within:border-[#6F8E2E] transition-colors py-1">
                <Lock className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-transparent text-[16px] text-[#111827] py-1 outline-none placeholder-slate-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 outline-none shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Custom Styled Checkbox & Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-[20px] h-[20px]">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="opacity-0 absolute inset-0 z-10 cursor-pointer" 
                  />
                  <div className={`absolute inset-0 border-2 rounded-[6px] transition-all duration-200 flex items-center justify-center
                    ${rememberMe ? 'bg-[#6F8E2E] border-[#6F8E2E]' : 'border-slate-200 bg-transparent group-hover:border-slate-400'}`}>
                    <Check className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${rememberMe ? 'scale-100' : 'scale-0'}`} />
                  </div>
                </div>
                <span className="text-[14px] text-slate-500 font-medium select-none">Remember me</span>
              </label>
              
              <button type="button" className="text-[14px] text-slate-500 hover:text-[#6F8E2E] font-medium transition-colors">
                Need help?
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-[16px] font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-150 text-[#FFFFFF] shadow-lg
                ${loading 
                  ? 'bg-slate-400 shadow-slate-400/20 cursor-not-allowed'
                  : 'bg-[#6F8E2E] shadow-[#6F8E2E]/20 hover:bg-[#2C3E17] active:scale-[0.98]'
                }`}
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
            <p className="text-[16px] text-slate-500">
              {isSignUp ? 'Already have an account?' : 'New here?'} 
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                }}
                className="font-bold text-[#6F8E2E] hover:underline decoration-2 underline-offset-4 ml-1.5"
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
