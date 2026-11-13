import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginModal({ schoolName, onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();
    const validAccounts = [
      { email: 'admin@kpandoanglican.edu.gh', pass: 'admin123', name: 'School Administrator', role: 'Super Admin' },
      { email: 'admin@school.edu.gh', pass: 'admin123', name: 'School Administrator', role: 'Super Admin' },
      { email: 'headmaster@kpandoanglican.edu.gh', pass: 'admin123', name: 'Mr. Emmanuel K. Adjei', role: 'Headmaster' },
      { email: 'basic9@kpandoanglican.edu.gh', pass: 'teacher123', name: 'Mr. Godwin Mensah', role: 'Basic 9 Form Master' }
    ];

    const matched = validAccounts.find((a) => a.email === cleanEmail && a.pass === password);
    if (matched) {
      setError('');
      setAttempts(0);
      toast.success(`Welcome back, ${matched.name}`);
      onLoginSuccess({
        email: matched.email,
        name: matched.name,
        role: matched.role
      });
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      setLockoutSeconds(30);
      setAttempts(0);
      setError('Too many failed attempts. Login locked for 30 seconds.');
    } else {
      setError(`Invalid credentials (${5 - nextAttempts} attempts remaining).`);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@kpandoanglican.edu.gh');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/40 to-slate-200 dark:from-[#09090b] dark:via-emerald-950/20 dark:to-zinc-950 p-4">
      <div className="w-full max-w-md glass-card p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to School Website
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/anglican-crest.png"
            alt="Kpando Anglican Basic School Crest"
            className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-zinc-700"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> WebSBA &amp; SMS Portal
            </div>
            <h1 className="text-xl font-black tracking-tight">{schoolName}</h1>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error} {lockoutSeconds > 0 ? `(${lockoutSeconds}s)` : ''}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu.gh"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutSeconds > 0}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
          >
            {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Demo Access</span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5" /> Fill Admin Credentials
            </button>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900/70 rounded-xl p-3 font-mono space-y-1">
            <div>Admin: <strong>admin@kpandoanglican.edu.gh</strong> / <strong>admin123</strong></div>
            <div>Basic 9 Teacher: <strong>basic9@kpandoanglican.edu.gh</strong> / <strong>teacher123</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
