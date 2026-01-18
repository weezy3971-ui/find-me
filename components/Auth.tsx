
import React, { useState, useEffect } from 'react';
import { User, AuthView } from '../types';
import { Mail, Lock, User as UserIcon, Shield, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  sendEmailVerification
} from '../firebase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>(AuthView.LOGIN);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    repeatPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastEmailUsed, setLastEmailUsed] = useState('');

  // Requirement: Default credentials for convenience during testing/review
  useEffect(() => {
    if (view === AuthView.LOGIN || view === AuthView.ADMIN) {
      setFormData(prev => ({
        ...prev,
        email: 'admin@platform.com',
        password: 'Cuk0987'
      }));
    } else if (view === AuthView.REGISTER) {
      setFormData({ name: '', email: '', password: '', repeatPassword: '' });
    }
    setError(null);
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === AuthView.REGISTER) {
        if (formData.password !== formData.repeatPassword) {
          throw new Error("Passwords do not match");
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        // 1. Send verification email via Firebase Auth
        await sendEmailVerification(userCredential.user);
        
        // 2. Requirement: Do not sign them in automatically after registration
        await signOut(auth);
        
        // 3. Set email for the verification screen display
        setLastEmailUsed(formData.email);
        
        // 4. Show the verification screen
        setView(AuthView.VERIFY_EMAIL);
      } else {
        // Login or Admin View
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );

          // Requirement: Direct login without verification check for existing users
          onLogin({
            name: userCredential.user.displayName || 'User',
            email: userCredential.user.email || formData.email,
            type: view === AuthView.ADMIN ? 'ADMIN' : 'PUBLIC'
          });
        } catch (err: any) {
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            throw new Error("Password or Email Incorrect");
          }
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      
      // Handle common Firebase Auth error codes
      if (err.code === 'auth/email-already-in-use') {
        setError("User already exists. Sign in instead?");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Please wait a moment before trying again.");
      } else if (err.message === "Password or Email Incorrect") {
        setError("Password or Email Incorrect");
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Dedicated Verification Screen
  if (view === AuthView.VERIFY_EMAIL) {
    return (
      <div className="flex h-screen bg-[#0B0F19] items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#0D1424] p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center space-y-8 animate-in zoom-in duration-300">
          <div className="mx-auto w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Send className="text-blue-500" size={42} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight">Verify Email</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              We have sent you a verification email to <span className="text-blue-400 font-bold">{lastEmailUsed}</span>. Verify it and log in.
            </p>
          </div>
          <button 
            onClick={() => setView(AuthView.LOGIN)}
            className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] transform"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0F172A]">
      {/* Left Side: Hero Brand Area */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 z-0" />
        <div className="relative z-10 p-24 flex flex-col h-full">
          <div className="mt-20">
            <h1 className="text-[5rem] leading-[1.1] font-black text-white tracking-tighter mb-8">
              Reuniting<br />Families<br />Safely.
            </h1>
            <p className="text-xl text-blue-100 font-medium max-w-md leading-relaxed">
              A community-driven digital network helping reunite families in Kenya.
            </p>
          </div>

          <div className="mt-auto flex gap-6">
            <div className="bg-white/10 backdrop-blur-md px-10 py-8 rounded-[2rem] border border-white/10">
              <div className="text-4xl font-black text-white mb-1">128</div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Active Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-10 py-8 rounded-[2rem] border border-white/10">
              <div className="text-4xl font-black text-white mb-1">42</div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Reunited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-[#0B0F19]">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center space-y-4">
             <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6">
                 <Shield className="text-white" size={32} fill="white" />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tight">
               {view === AuthView.REGISTER ? 'Join Find Me' : view === AuthView.LOGIN ? 'Welcome Back' : 'Admin Gateway'}
             </h2>
             <p className="text-slate-400 font-medium tracking-tight">
                Secure community portal for Kenya
             </p>
          </div>

          {/* Form Switcher */}
          <div className="bg-[#0D1424] p-1.5 rounded-xl border border-slate-800/50 shadow-inner flex">
            <button 
                onClick={() => setView(AuthView.LOGIN)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                    view === AuthView.LOGIN ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                }`}>LOGIN</button>
            <button 
                onClick={() => setView(AuthView.REGISTER)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                    view === AuthView.REGISTER ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                }`}>REGISTER</button>
            <button 
                onClick={() => setView(AuthView.ADMIN)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                    view === AuthView.ADMIN ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}>ADMIN</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <span className="text-red-500 text-xs font-bold uppercase tracking-tight flex-1">
                  {error}
                </span>
              </div>
            )}

            {view === AuthView.REGISTER && (
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Samuel Okoth"
                    className="w-full pl-12 pr-5 py-4 bg-[#0D1424] border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium placeholder:text-slate-600 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-[#0D1424] border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium placeholder:text-slate-600 transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                 {view === AuthView.LOGIN && (
                    <button type="button" className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">Forgot Password?</button>
                 )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-[#0D1424] border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium placeholder:text-slate-600 transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {view === AuthView.REGISTER && (
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Repeat Password</label>
                <div className="relative group">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4 bg-[#0D1424] border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium placeholder:text-slate-600 transition-all"
                    value={formData.repeatPassword}
                    onChange={e => setFormData({...formData, repeatPassword: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                view === AuthView.ADMIN 
                    ? 'bg-orange-600 shadow-orange-600/25 hover:bg-orange-700' 
                    : 'bg-blue-600 shadow-blue-600/25 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                view === AuthView.REGISTER ? 'Create Account' : view === AuthView.LOGIN ? 'Enter Dashboard' : 'Access Admin Portal'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
