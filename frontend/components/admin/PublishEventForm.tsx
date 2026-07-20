'use client';

import { useState } from 'react';
import { Bell, FileText, Tag, Users, ClipboardList, CalendarClock, Clock, MapPin, Link as LinkIcon } from 'lucide-react';
import {
  type EventForm,
  type Status,
  EMPTY_EVENT,
  MOCK_EVENT_FULL,
  MOCK_EVENT_NOTICE,
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

export default function PublishEventForm({ apiBase, getAuthHeaders, onAuthError }: Props) {
  const [form, setForm] = useState<EventForm>(EMPTY_EVENT);
  const [status, setStatus] = useState<Status>(IDLE_STATUS);

  const handleChange =
    (field: keyof EventForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      sender: form.sender.trim() || 'Research Wing, AnC',
      category: form.category,
      description: form.description.trim(),
      ...(form.date ? { date: form.date } : {}),
      ...(form.time.trim() ? { time: form.time.trim() } : {}),
      ...(form.venue.trim() ? { venue: form.venue.trim() } : {}),
      ...(form.link.trim() ? { link: form.link.trim() } : {}),
    };

    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch(`${apiBase}/api/events`, {
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
        message: `"${payload.title || 'Item'}" has been published to the Events & Notifications hub.`,
      });
      setForm(EMPTY_EVENT);
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not publish this event/notification. Please check the details and try again.',
      });
    }
  };

  const loading = status.state === 'loading';

  return (
    <SectionCard
      icon={Bell}
      title="Publish Event or Notification"
      description="Post events, notices, or urgent alerts to the student hub."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AutoFillButton
          onClick={() => setForm(Math.random() > 0.5 ? MOCK_EVENT_FULL : MOCK_EVENT_NOTICE)}
          disabled={loading}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={FileText} required>Title</FieldLabel>
            <input
              name="title" type="text" required
              placeholder="Research Symposium 2026"
              value={form.title} onChange={handleChange('title')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={Tag} required>Category</FieldLabel>
            <select
              name="category" required
              value={form.category} onChange={handleChange('category')} disabled={loading}
              className={inputClasses}
            >
              <option value="" disabled>Select category</option>
              <option value="Event">Event</option>
              <option value="Notice">Notice</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <FieldLabel icon={Users}>Sender / Organizer</FieldLabel>
          <input
            name="sender" type="text"
            placeholder="Research Wing, AnC"
            value={form.sender} onChange={handleChange('sender')} disabled={loading}
            className={inputClasses}
          />
        </div>

        <div>
          <FieldLabel icon={ClipboardList} required>Description</FieldLabel>
          <textarea
            name="description" required rows={4}
            placeholder="Describe the event or notification in detail..."
            value={form.description} onChange={handleChange('description')} disabled={loading}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={CalendarClock}>Date</FieldLabel>
            <input
              name="date" type="date"
              value={form.date} onChange={handleChange('date')} disabled={loading}
              className={inputClasses}
            />
            <p className="mt-1 text-[11px] text-charcoal/50">Optional for notices.</p>
          </div>
          <div>
            <FieldLabel icon={Clock}>Time</FieldLabel>
            <input
              name="time" type="text"
              placeholder="10:00 AM – 5:00 PM"
              value={form.time} onChange={handleChange('time')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel icon={MapPin}>Venue</FieldLabel>
            <input
              name="venue" type="text"
              placeholder="L-20 Lecture Hall Complex"
              value={form.venue} onChange={handleChange('venue')} disabled={loading}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel icon={LinkIcon}>Link</FieldLabel>
            <input
              name="link" type="url"
              placeholder="https://example.org/event"
              value={form.link} onChange={handleChange('link')} disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-auto pt-2">
          <SubmitButton loading={loading} icon={Bell} label="Publish Event / Notification" loadingLabel="Publishing..." />
          <StatusBanner status={status} />
        </div>
      </form>
    </SectionCard>
  );
}
