'use client';

import { useEffect, useState } from 'react';
import PortalNavbar from '@/components/portal-navbar';

type InternshipItem = {
  _id?: string;
  universityName: string;
  internshipProgramName: string;
  country: string;
  applicationLink: string;
  eligibility?: string;
  deadline?: string;
};

export default function InternationalInternshipsPage() {
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/internships`);
        if (!res.ok) {
          throw new Error('Failed to load internships');
        }

        const data = await res.json();
        setInternships(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <PortalNavbar
        title="International Internships"
        backHref="/portal"
        backLabel="Back to Portal"
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            International Internships
          </p>
          <h1 className="font-serif text-3xl font-bold text-maroon sm:text-4xl">
            Discover global internship opportunities
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal/70">
            Browse the latest programs from universities around the world and apply directly through the official links.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-xl border border-gold/20 bg-white p-8 text-center text-charcoal/50 shadow-sm">
            Loading internship opportunities…
          </div>
        ) : internships.length === 0 ? (
          <div className="rounded-xl border border-gold/20 bg-white p-8 text-center text-charcoal/50 shadow-sm">
            No internship opportunities are available right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {internships.map((internship) => (
              <div
                key={internship._id || internship.applicationLink}
                className="flex h-full flex-col rounded-xl border border-gold/20 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gold/50"
              >
                {/* Country badge + deadline */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
                    {internship.country}
                  </span>
                  {internship.deadline ? (
                    <span className="text-xs text-charcoal/50">
                      Deadline: {new Date(internship.deadline).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>

                {/* University */}
                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  {internship.universityName}
                </h2>

                {/* Programme name */}
                <p className="mt-2 text-sm font-medium text-maroon">
                  {internship.internshipProgramName}
                </p>

                {/* Eligibility */}
                {internship.eligibility ? (
                  <p className="mt-3 text-sm text-charcoal/70">
                    Eligibility: {internship.eligibility}
                  </p>
                ) : null}

                {/* Apply button */}
                <a
                  href={internship.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-gold/90 shadow-sm"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-maroon text-cream mt-16 py-6">
        <p className="text-center text-sm text-cream/60">
          © 2026 Research Wing, Academics &amp; Careers · IIT Kanpur
        </p>
      </footer>
    </div>
  );
}
