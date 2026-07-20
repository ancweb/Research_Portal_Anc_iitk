'use client';

import { useState } from 'react';
import { Briefcase, FileText, GraduationCap, Building2, Users, Wallet, CalendarClock } from 'lucide-react';
import {
  type VacancyForm,
  type Status,
  EMPTY_VACANCY,
  MOCK_VACANCY,
  DEPARTMENTS,
  IDLE_STATUS,
} from './types';
import {
  inputClasses,
  FieldLabel,
  StatusBanner,
  AutoFillButton,
  SubmitButton,
  SectionCard,
} from './shared';

type Props = { apiBase: string; getAuthHeaders: () => Record<string, string>; onAuthError: (res: Response) => boolean };

export default function PostVacancyForm({ apiBase, getAuthHeaders, onAuthError }: Props) {
  const [form, setForm] = useState<VacancyForm>(EMPTY_VACANCY);
  const [status, setStatus] = useState<Status>(IDLE_STATUS);

  const handleChange =
    (field: keyof VacancyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...form };

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch(`${apiBase}/api/vacancies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (onAuthError(res)) return;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Request failed');
      }
      setStatus({ state: 'success', message: `"${payload.projectTitle || 'Vacancy'}" is now live on the notice board.` });
      setForm(EMPTY_VACANCY);
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not post this vacancy. Please check the details and try again.',
      });
    }
  };

  const loading = status.state === 'loading';

  return (
    <SectionCard
      icon={Briefcase}
      title="Post Live Project Vacancy"
      description="Publish an open position to the student notice board."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AutoFillButton onClick={() => setForm(MOCK_VACANCY)} disabled={loading} />

        <div>
          <FieldLabel icon={FileText} required>Project Title</FieldLabel>
          <input
            name="projectTitle" type="text" required
            placeholder="Deep Learning for Satellite Imagery"
            value={form.projectTitle} onChange={handleChange('projectTitle')} disabled={loading}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel icon={GraduationCap} required>Professor Name</FieldLabel>
            <input
              name="professorName" type="text" required
              placeholder="Dr. Rohan Sharma"
              value={form.professorName} onChange={handleChange('professorName')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={Building2} required>Department</FieldLabel>
            <select
              name="department" required
              value={form.department} onChange={handleChange('department')} disabled={loading}
              className={inputClasses}
            >
              <option value="" disabled>Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel icon={FileText} required>Project Description</FieldLabel>
          <textarea
            name="description" required rows={4}
            placeholder="Briefly describe the project scope, goals, and what the student will work on..."
            value={form.description} onChange={handleChange('description')} disabled={loading}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div>
          <FieldLabel icon={Users} required>Eligibility</FieldLabel>
          <input
            name="eligibility" type="text" required
            placeholder="Y23/Y24 UG undergraduates"
            value={form.eligibility} onChange={handleChange('eligibility')} disabled={loading}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel icon={Wallet} required>Stipend</FieldLabel>
            <input
              name="stipend" type="text" required
              placeholder="Unpaid / SURGE equivalent"
              value={form.stipend} onChange={handleChange('stipend')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={CalendarClock} required>Application Deadline</FieldLabel>
            <input
              name="deadline" type="date" required
              value={form.deadline} onChange={handleChange('deadline')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-auto pt-2">
          <SubmitButton loading={loading} icon={Briefcase} label="Post Vacancy" />
          <StatusBanner status={status} />
        </div>
      </form>
    </SectionCard>
  );
}
