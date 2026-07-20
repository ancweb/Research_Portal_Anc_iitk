'use client';

import { type ReactNode } from 'react';
import { CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import { type Status } from './types';

// ── Tailwind class string for all form inputs ────────────────────────────────

export const inputClasses =
  'w-full rounded-md border border-gold/30 bg-white px-3.5 py-2.5 text-sm text-maroon placeholder:text-charcoal/40 shadow-sm transition focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 disabled:bg-cream disabled:text-charcoal/40';

// ── FieldLabel ───────────────────────────────────────────────────────────────

export function FieldLabel({
  icon: Icon,
  children,
  required,
}: {
  icon: LucideIcon;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-maroon/70 mb-1.5">
      <Icon className="w-3.5 h-3.5 text-maroon" />
      {children}
      {required && <span className="text-maroon">*</span>}
    </label>
  );
}

// ── StatusBanner ─────────────────────────────────────────────────────────────

export function StatusBanner({ status }: { status: Status | null }) {
  if (!status || status.state === 'idle' || status.state === 'loading') return null;

  const isSuccess = status.state === 'success';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm mt-5 animate-[fadeIn_0.2s_ease-in-out] ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
      role="status"
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
      ) : (
        <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
      )}
      <span className="leading-snug">{status.message}</span>
    </div>
  );
}

// ── AutoFillButton ───────────────────────────────────────────────────────────

import { Sparkles } from 'lucide-react';

export function AutoFillButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="text-xs font-semibold text-maroon bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 rounded px-2.5 py-1 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-3 h-3 text-maroon" />
        Auto-Fill Dummy Data
      </button>
    </div>
  );
}

// ── SubmitButton ─────────────────────────────────────────────────────────────

import { Loader2 } from 'lucide-react';

export function SubmitButton({
  loading,
  icon: Icon,
  label,
  loadingLabel = 'Submitting...',
}: {
  loading: boolean;
  icon: LucideIcon;
  label: string;
  loadingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90 disabled:bg-gray-400 disabled:cursor-not-allowed ${
        loading ? 'opacity-95' : ''
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Icon className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}

// ── SectionCard ──────────────────────────────────────────────────────────────
// Wraps a form in the standard white card with a branded header.

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-gold/20 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gold/10 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
          <Icon className="w-5 h-5 text-maroon" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-maroon">{title}</h2>
          <p className="text-xs text-charcoal/60">{description}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-6">{children}</div>
    </section>
  );
}
