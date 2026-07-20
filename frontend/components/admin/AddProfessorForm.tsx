'use client';

import { useState } from 'react';
import { UserPlus, GraduationCap, Building2, ClipboardList, Mail, Link as LinkIcon } from 'lucide-react';
import {
  type ProfessorForm,
  type Status,
  EMPTY_PROFESSOR,
  MOCK_PROFESSOR,
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

export default function AddProfessorForm({ apiBase, getAuthHeaders, onAuthError }: Props) {
  const [form, setForm] = useState<ProfessorForm>(EMPTY_PROFESSOR);
  const [status, setStatus] = useState<Status>(IDLE_STATUS);

  const handleChange =
    (field: keyof ProfessorForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      department: form.department,
      researchInterests: form.researchInterests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      email: form.email.trim(),
      labWebsite: form.labWebsite.trim(),
    };

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch(`${apiBase}/api/professors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (onAuthError(res)) return;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Request failed');
      }
      setStatus({ state: 'success', message: `Profile for ${payload.name || 'the professor'} was added successfully.` });
      setForm(EMPTY_PROFESSOR);
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not save this profile. Please check the details and try again.',
      });
    }
  };

  const loading = status.state === 'loading';

  return (
    <SectionCard
      icon={UserPlus}
      title="Add New Professor Profile"
      description="Register a faculty member on the research directory."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AutoFillButton onClick={() => setForm(MOCK_PROFESSOR)} disabled={loading} />

        <div>
          <FieldLabel icon={GraduationCap} required>Professor Name</FieldLabel>
          <input
            name="name" type="text" required
            placeholder="Dr. Rohan Sharma"
            value={form.name} onChange={handleChange('name')} disabled={loading}
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

        <div>
          <FieldLabel icon={ClipboardList} required>Research Interests</FieldLabel>
          <input
            name="researchInterests" type="text" required
            placeholder="Machine Learning, Robotics, Computer Vision"
            value={form.researchInterests} onChange={handleChange('researchInterests')} disabled={loading}
            className={inputClasses}
          />
          <p className="mt-1 text-[11px] text-charcoal/50">Separate multiple interests with commas.</p>
        </div>

        <div>
          <FieldLabel icon={Mail} required>Email</FieldLabel>
          <input
            name="email" type="email" required
            placeholder="professor@iitk.ac.in"
            value={form.email} onChange={handleChange('email')} disabled={loading}
            className={inputClasses}
          />
        </div>

        <div>
          <FieldLabel icon={LinkIcon}>Lab Website URL</FieldLabel>
          <input
            name="labWebsite" type="url"
            placeholder="https://labsite.iitk.ac.in"
            value={form.labWebsite} onChange={handleChange('labWebsite')} disabled={loading}
            className={inputClasses}
          />
        </div>

        <div className="mt-auto pt-2">
          <SubmitButton loading={loading} icon={UserPlus} label="Add Professor Profile" />
          <StatusBanner status={status} />
        </div>
      </form>
    </SectionCard>
  );
}
