'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';

type LoginStatus = {
  state: 'idle' | 'loading' | 'error';
  message: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<LoginStatus>({
    state: 'idle',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/portal/admin');
    } catch (err) {
      setStatus({
        state: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-maroon via-maroon/90 to-charcoal px-4 overflow-hidden">
      {/* Soft ambient glows using brand colours */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cream/5 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <a
          href="/portal"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-cream/50 transition hover:text-cream/80"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Portal
        </a>

        {/* Card */}
        <div className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Logo + Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20 border border-gold/30 shadow-lg shadow-gold/10">
              <ShieldCheck className="h-8 w-8 text-gold" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-cream">Admin Login</h1>
            <p className="mt-2 text-sm text-cream/50">
              Research Wing, AnC &middot; IIT Kanpur
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cream/60">
                <Mail className="h-3.5 w-3.5" />
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@iitk.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.state === 'loading'}
                className="w-full rounded-lg border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cream/60">
                <Lock className="h-3.5 w-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status.state === 'loading'}
                  className="w-full rounded-lg border border-cream/10 bg-cream/5 px-4 py-3 pr-12 text-sm text-cream placeholder:text-cream/30 transition focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 transition hover:text-cream/60"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {status.state === 'error' && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-[fadeIn_0.2s_ease-in-out]">
                <span className="mt-0.5 text-red-400">✕</span>
                <span className="leading-snug">{status.message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status.state === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-charcoal shadow-lg shadow-gold/20 transition hover:bg-gold/90 hover:shadow-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.state === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p className="mt-6 text-center text-xs text-cream/30">
            Restricted to Research Wing coordinators.
            <br />
            Contact your admin if you need access.
          </p>
        </div>

        {/* Subtle branding */}
        <p className="mt-6 text-center text-[11px] text-cream/20">
          IIT Kanpur Research Wing Portal
        </p>
      </div>
    </div>
  );
}
