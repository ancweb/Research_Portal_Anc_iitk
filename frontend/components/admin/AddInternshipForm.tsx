'use client';

import { useState } from 'react';
import { Globe2, Building2, ClipboardList, Link as LinkIcon, Users, CalendarClock } from 'lucide-react';
import {
  type InternshipForm,
  type Status,
  EMPTY_INTERNSHIP,
  MOCK_INTERNSHIP,
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

export default function AddInternshipForm({ apiBase, getAuthHeaders, onAuthError }: Props) {
  const [form, setForm] = useState<InternshipForm>(EMPTY_INTERNSHIP);
  const [status, setStatus] = useState<Status>(IDLE_STATUS);

  const handleChange =
    (field: keyof InternshipForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      universityName: form.universityName.trim(),
      internshipProgramName: form.internshipProgramName.trim(),
      country: form.country.trim(),
      applicationLink: form.applicationLink.trim(),
      eligibility: form.eligibility.trim(),
      deadline: form.deadline,
    };

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch(`${apiBase}/api/internships`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (onAuthError(res)) return;
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Request failed');
      }
      setStatus({
        state: 'success',
        message: `"${payload.internshipProgramName || 'Internship'}" is now available for applicants.`,
      });
      setForm(EMPTY_INTERNSHIP);
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not save this internship opportunity. Please check the details and try again.',
      });
    }
  };

  const loading = status.state === 'loading';

  return (
    <SectionCard
      icon={Globe2}
      title="Add International Internship Opportunity"
      description="Publish a new global internship program for prospective students."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AutoFillButton onClick={() => setForm(MOCK_INTERNSHIP)} disabled={loading} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={Building2} required>University Name</FieldLabel>
            <input
              name="universityName" type="text" required
              placeholder="University of Toronto"
              value={form.universityName} onChange={handleChange('universityName')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={ClipboardList} required>Program Name</FieldLabel>
            <input
              name="internshipProgramName" type="text" required
              placeholder="Mitacs, DAAD, Viterbi"
              value={form.internshipProgramName} onChange={handleChange('internshipProgramName')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={Building2} required>Country</FieldLabel>
            <input
              name="country" type="text" required
              placeholder="Canada"
              value={form.country} onChange={handleChange('country')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={LinkIcon} required>Application Link</FieldLabel>
            <input
              name="applicationLink" type="url" required
              placeholder="https://example.org/apply"
              value={form.applicationLink} onChange={handleChange('applicationLink')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={Users}>Eligibility</FieldLabel>
            <input
              name="eligibility" type="text"
              placeholder="Third year UG"
              value={form.eligibility} onChange={handleChange('eligibility')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={CalendarClock}>Deadline</FieldLabel>
            <input
              name="deadline" type="date"
              value={form.deadline} onChange={handleChange('deadline')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-auto pt-2">
          <SubmitButton loading={loading} icon={Globe2} label="Add Internship Opportunity" />
          <StatusBanner status={status} />
        </div>
      </form>
    </SectionCard>
  );
}
