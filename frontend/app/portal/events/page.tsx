'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Info,
  Loader2,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import PortalNavbar from '@/components/portal-navbar';

type EventItem = {
  _id: string;
  title: string;
  sender: string;
  category: 'Event' | 'Notice' | 'Urgent';
  description: string;
  date?: string;
  time?: string;
  venue?: string;
  link?: string;
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/** Category card styles aligned to the IITK maroon/gold/cream palette */
const CATEGORY_STYLES: Record<
  EventItem['category'],
  { border: string; bg: string; badge: string; badgeBg: string; icon: typeof Bell; pulseRing?: string }
> = {
  Event: {
    border: 'border-l-gold',
    bg: 'bg-gold/10',
    badge: 'text-maroon',
    badgeBg: 'bg-gold/20',
    icon: Sparkles,
  },
  Notice: {
    border: 'border-l-maroon',
    bg: 'bg-maroon/5',
    badge: 'text-maroon',
    badgeBg: 'bg-maroon/10',
    icon: Info,
  },
  Urgent: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    badge: 'text-red-700',
    badgeBg: 'bg-red-100',
    icon: AlertTriangle,
    pulseRing: 'ring-2 ring-red-200 animate-[pulse_2s_infinite]',
  },
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Event' | 'Notice' | 'Urgent'>('All');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents =
    filter === 'All' ? events : events.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen bg-cream">
      {/* Shared branded navbar */}
      <PortalNavbar
        title="Events & Notices"
        backHref="/portal"
        backLabel="Back to Portal"
        actions={
          <div className="hidden sm:flex items-center gap-2 text-charcoal/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-maroon/10">
              <Megaphone className="w-4 h-4 text-maroon" />
            </div>
          </div>
        }
      />

      {/* Sub-header with filter pills */}
      <div className="border-b border-gold/20 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-bold text-maroon sm:text-2xl">Notice Board</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Stay updated with events, notices, and important announcements.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Event', 'Notice', 'Urgent'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filter === cat
                    ? 'bg-maroon text-cream shadow-sm'
                    : 'bg-gold/10 text-charcoal hover:bg-gold/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-charcoal/40">
            <Loader2 className="h-8 w-8 animate-spin mb-3 text-maroon" />
            <p className="text-sm">Loading events &amp; notifications…</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gold/30 bg-white p-12 text-center shadow-sm">
            <Bell className="h-12 w-12 mx-auto text-gold/40 mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">No items to show</h3>
            <p className="text-sm text-charcoal/60 max-w-md mx-auto">
              {filter === 'All'
                ? 'No events or notifications have been published yet. Check back later!'
                : `No ${filter.toLowerCase()} items found. Try switching to "All".`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEvents.map((item) => {
              const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Notice;
              const CategoryIcon = style.icon;
              const hasEventDetails = item.date || item.time || item.venue;

              return (
                <article
                  key={item._id}
                  className={`group rounded-xl border border-gold/20 bg-white shadow-sm transition-all duration-300 hover:shadow-md border-l-4 ${style.border} ${
                    item.category === 'Urgent' ? style.pulseRing : ''
                  }`}
                >
                  <div className="px-6 py-5">
                    {/* Top row: badge + time */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.badgeBg} ${style.badge}`}
                      >
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {item.category}
                      </span>
                      <span className="text-xs text-charcoal/40">{timeAgo(item.createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-lg font-bold text-maroon mb-1 group-hover:text-maroon/80 transition-colors">
                      {item.title}
                    </h2>

                    {/* Sender */}
                    <p className="text-xs text-charcoal/50 mb-3">
                      Posted by <span className="font-medium text-charcoal/70">{item.sender}</span>
                    </p>

                    {/* Description */}
                    <p className="text-sm text-charcoal/70 leading-relaxed mb-4 whitespace-pre-line">
                      {item.description}
                    </p>

                    {/* Event details */}
                    {hasEventDetails && (
                      <div className={`flex flex-wrap gap-4 rounded-lg px-4 py-3 text-sm ${style.bg} mb-4`}>
                        {item.date && (
                          <div className="flex items-center gap-1.5 text-charcoal/70">
                            <Calendar className="w-4 h-4 text-maroon/60" />
                            <span>{new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                        {item.time && (
                          <div className="flex items-center gap-1.5 text-charcoal/70">
                            <Clock className="w-4 h-4 text-maroon/60" />
                            <span>{item.time}</span>
                          </div>
                        )}
                        {item.venue && (
                          <div className="flex items-center gap-1.5 text-charcoal/70">
                            <MapPin className="w-4 h-4 text-maroon/60" />
                            <span>{item.venue}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA link */}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2 text-xs font-semibold text-cream shadow-sm transition hover:bg-maroon/90"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Details / Apply
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-maroon text-cream mt-8 py-6">
        <p className="text-center text-sm text-cream/60">
          © 2026 Research Wing, Academics &amp; Careers · IIT Kanpur
        </p>
      </footer>
    </div>
  );
}
