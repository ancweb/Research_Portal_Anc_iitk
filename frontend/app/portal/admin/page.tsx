'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserPlus,
  Briefcase,
  GraduationCap,
  Globe2,
  Mail,
  Link as LinkIcon,
  Wallet,
  CalendarClock,
  FileText,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ClipboardList,
  Bell,
  MapPin,
  Clock,
  Tag,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import PortalNavbar from '@/components/portal-navbar';

const DEPARTMENTS = ['CSE', 'EE', 'ME', 'BSBE', 'MSE', 'ChE', 'AE'];

type ProfessorForm = {
  name: string;
  department: string;
  researchInterests: string;
  email: string;
  labWebsite: string;
};

type VacancyForm = {
  projectTitle: string;
  professorName: string;
  department: string;
  description: string;
  eligibility: string;
  stipend: string;
  deadline: string;
};

type InternshipForm = {
  universityName: string;
  internshipProgramName: string;
  country: string;
  applicationLink: string;
  eligibility: string;
  deadline: string;
};

type EventForm = {
  title: string;
  sender: string;
  category: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  link: string;
};

const EMPTY_PROFESSOR: ProfessorForm = {
  name: '',
  department: '',
  researchInterests: '',
  email: '',
  labWebsite: '',
};

const EMPTY_VACANCY: VacancyForm = {
  projectTitle: '',
  professorName: '',
  department: '',
  description: '',
  eligibility: '',
  stipend: 'Unpaid / SURGE equivalent',
  deadline: '',
};

const EMPTY_INTERNSHIP: InternshipForm = {
  universityName: '',
  internshipProgramName: '',
  country: '',
  applicationLink: '',
  eligibility: '',
  deadline: '',
};

const EMPTY_EVENT: EventForm = {
  title: '',
  sender: 'Research Wing, AnC',
  category: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  link: '',
};

const MOCK_EVENT_FULL: EventForm = {
  title: 'Research Symposium 2026 — Student Presentations',
  sender: 'Research Wing, AnC',
  category: 'Event',
  description: 'Annual research symposium showcasing undergraduate and postgraduate research projects. Includes poster presentations, lightning talks, and a keynote by a distinguished alumnus. Open to all students and faculty.',
  date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  time: '10:00 AM – 5:00 PM',
  venue: 'L-20 Lecture Hall Complex, IIT Kanpur',
  link: 'https://iitk.ac.in/research-symposium-2026',
};

const MOCK_EVENT_NOTICE: EventForm = {
  title: 'SURGE 2026 Applications Now Open',
  sender: 'Dean of Research, IIT Kanpur',
  category: 'Notice',
  description: 'Applications for the Summer Undergraduate Research Grant for Excellence (SURGE) 2026 are now open. Eligible students from Y23/Y24 batches across all departments can apply. Last date to submit the online form is July 30, 2026. For details, visit the SURGE portal or contact your department coordinator.',
  date: '',
  time: '',
  venue: '',
  link: 'https://surge.iitk.ac.in',
};

const MOCK_PROFESSOR: ProfessorForm = {
  name: 'Dr. Amit Sharma',
  department: 'CSE',
  researchInterests: 'Machine Learning, Computer Vision, Deep Learning',
  email: 'amit.sharma@iitk.ac.in',
  labWebsite: 'https://lab.iitk.ac.in/ml',
};

const MOCK_VACANCY: VacancyForm = {
  projectTitle: 'Autonomous Drone Path Planning',
  professorName: 'Dr. Amit Sharma',
  department: 'CSE',
  description: 'Looking for enthusiastic undergraduate students to work on path planning and collision avoidance algorithms for autonomous drones using ROS and deep reinforcement learning.',
  eligibility: 'Y23/Y24 B.Tech/Dual Degree students with strong python/C++ programming skills.',
  stipend: 'SURGE equivalent / ₹10,000 per month',
  deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

const MOCK_INTERNSHIP: InternshipForm = {
  universityName: 'University of Toronto',
  internshipProgramName: 'Mitacs Globalink Research Internship',
  country: 'Canada',
  applicationLink: 'https://www.mitacs.ca/en/programs/globalink/globalink-research-internship',
  eligibility: 'Pre-final year undergraduate students (3rd year B.Tech/4th year Dual Degree).',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

type Status = {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

function StatusBanner({ status }: { status: Status | null }) {
  if (!status || status.state === 'idle') return null;

  const isSuccess = status.state === 'success';
  const isError = status.state === 'error';

  if (!isSuccess && !isError) return null;

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

function FieldLabel({ icon: Icon, children, required }: { icon: LucideIcon; children: ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-maroon/70 mb-1.5">
      <Icon className="w-3.5 h-3.5 text-maroon" />
      {children}
      {required && <span className="text-maroon">*</span>}
    </label>
  );
}

const inputClasses =
  'w-full rounded-md border border-gold/30 bg-white px-3.5 py-2.5 text-sm text-maroon placeholder:text-charcoal/40 shadow-sm transition focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 disabled:bg-cream disabled:text-charcoal/40';

export default function AdminPanelPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [professor, setProfessor] = useState<ProfessorForm>(EMPTY_PROFESSOR);
  const [vacancy, setVacancy] = useState<VacancyForm>(EMPTY_VACANCY);
  const [internship, setInternship] = useState<InternshipForm>(EMPTY_INTERNSHIP);
  const [event, setEvent] = useState<EventForm>(EMPTY_EVENT);

  const [professorStatus, setProfessorStatus] = useState<Status>({ state: 'idle', message: '' });
  const [vacancyStatus, setVacancyStatus] = useState<Status>({ state: 'idle', message: '' });
  const [internshipStatus, setInternshipStatus] = useState<Status>({ state: 'idle', message: '' });
  const [eventStatus, setEventStatus] = useState<Status>({ state: 'idle', message: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth guard: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/portal/admin/login');
      return;
    }
    // Verify token with the backend
    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/portal/admin/login');
      });
  }, [router, API_BASE_URL]);

  /** Helper: get auth headers for protected POST requests */
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  /** Handle 401 from any POST — clear token and redirect */
  const handleAuthError = (res: Response) => {
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.push('/portal/admin/login');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/portal/admin/login');
  };

  const handleProfessorChange = (field: keyof ProfessorForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfessor((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleVacancyChange = (field: keyof VacancyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVacancy((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInternshipChange = (field: keyof InternshipForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInternship((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEventChange = (field: keyof EventForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEvent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleProfessorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      name: professor.name.trim(),
      department: professor.department,
      researchInterests: professor.researchInterests
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean),
      email: professor.email.trim(),
      labWebsite: professor.labWebsite.trim(),
    };

    console.log('Form submitting...', formData);

    setProfessorStatus({ state: 'loading', message: '' });

    try {
      const payload = formData;

      const res = await fetch(`${API_BASE_URL}/api/professors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (handleAuthError(res)) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      setProfessorStatus({
        state: 'success',
        message: `Profile for ${payload.name || 'the professor'} was added successfully.`,
      });
      setProfessor(EMPTY_PROFESSOR);
    } catch (err) {
      setProfessorStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not save this profile. Please check the details and try again.',
      });
    }
  };

  const handleVacancySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { ...vacancy };
    console.log('Form submitting...', formData);

    setVacancyStatus({ state: 'loading', message: '' });

    try {
      const payload = formData;

      const res = await fetch(`${API_BASE_URL}/api/vacancies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (handleAuthError(res)) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      setVacancyStatus({
        state: 'success',
        message: `"${payload.projectTitle || 'Vacancy'}" is now live on the notice board.`,
      });
      setVacancy(EMPTY_VACANCY);
    } catch (err) {
      setVacancyStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not post this vacancy. Please check the details and try again.',
      });
    }
  };

  const handleInternshipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      universityName: internship.universityName.trim(),
      internshipProgramName: internship.internshipProgramName.trim(),
      country: internship.country.trim(),
      applicationLink: internship.applicationLink.trim(),
      eligibility: internship.eligibility.trim(),
      deadline: internship.deadline,
    };

    console.log('Form submitting...', formData);

    setInternshipStatus({ state: 'loading', message: '' });

    try {
      const payload = formData;

      const res = await fetch(`${API_BASE_URL}/api/internships`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (handleAuthError(res)) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      setInternshipStatus({
        state: 'success',
        message: `"${payload.internshipProgramName || 'Internship'}" is now available for applicants.`,
      });
      setInternship(EMPTY_INTERNSHIP);
    } catch (err) {
      setInternshipStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not save this internship opportunity. Please check the details and try again.',
      });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      title: event.title.trim(),
      sender: event.sender.trim() || 'Research Wing, AnC',
      category: event.category,
      description: event.description.trim(),
      ...(event.date ? { date: event.date } : {}),
      ...(event.time.trim() ? { time: event.time.trim() } : {}),
      ...(event.venue.trim() ? { venue: event.venue.trim() } : {}),
      ...(event.link.trim() ? { link: event.link.trim() } : {}),
    };

    console.log('Form submitting...', formData);

    setEventStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (handleAuthError(res)) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      setEventStatus({
        state: 'success',
        message: `"${formData.title || 'Item'}" has been published to the Events & Notifications hub.`,
      });
      setEvent(EMPTY_EVENT);
    } catch (err) {
      setEventStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Could not publish this event/notification. Please check the details and try again.',
      });
    }
  };

  // Show nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Shared branded navbar with logout action */}
      <PortalNavbar
        title="Admin Panel"
        backHref="/portal"
        backLabel="Back to Dashboard"
        actions={
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-maroon/30 px-4 py-2 text-sm font-medium text-maroon hover:bg-maroon hover:text-cream transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        }
      />

      {/* Sub-header strip */}
      <div className="border-b border-gold/20 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-bold text-maroon sm:text-2xl">Manage Portal Data</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Add professor profiles and publish live project vacancies for students.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-gold/20 bg-cream px-3 py-2 text-xs font-medium text-charcoal/70">
            <Users className="w-4 h-4 text-maroon" />
            Coordinators: Anshu &middot; Antriksh &middot; Neha
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form 1: Add New Professor Profile */}
          <section className="flex flex-col rounded-xl border border-gold/20 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gold/10 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                <UserPlus className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-maroon">Add New Professor Profile</h2>
                <p className="text-xs text-charcoal/60">Register a faculty member on the research directory.</p>
              </div>
            </div>

            <form onSubmit={handleProfessorSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setProfessor(MOCK_PROFESSOR)}
                  disabled={professorStatus.state === 'loading'}
                  className="text-xs font-semibold text-maroon bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 rounded px-2.5 py-1 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3 h-3 text-maroon" />
                  Auto-Fill Dummy Data
                </button>
              </div>
              <div>
                <FieldLabel icon={GraduationCap} required>
                  Professor Name
                </FieldLabel>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Dr. Rohan Sharma"
                  value={professor.name}
                  onChange={handleProfessorChange('name')}
                  disabled={professorStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel icon={Building2} required>
                  Department
                </FieldLabel>
                <select
                  name="department"
                  required
                  value={professor.department}
                  onChange={handleProfessorChange('department')}
                  disabled={professorStatus.state === 'loading'}
                  className={inputClasses}
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel icon={ClipboardList} required>
                  Research Interests
                </FieldLabel>
                <input
                  name="researchInterests"
                  type="text"
                  required
                  placeholder="Machine Learning, Robotics, Computer Vision"
                  value={professor.researchInterests}
                  onChange={handleProfessorChange('researchInterests')}
                  disabled={professorStatus.state === 'loading'}
                  className={inputClasses}
                />
                <p className="mt-1 text-[11px] text-charcoal/50">Separate multiple interests with commas.</p>
              </div>

              <div>
                <FieldLabel icon={Mail} required>
                  Email
                </FieldLabel>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="professor@iitk.ac.in"
                  value={professor.email}
                  onChange={handleProfessorChange('email')}
                  disabled={professorStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel icon={LinkIcon}>Lab Website URL</FieldLabel>
                <input
                  name="labWebsite"
                  type="url"
                  placeholder="https://labsite.iitk.ac.in"
                  value={professor.labWebsite}
                  onChange={handleProfessorChange('labWebsite')}
                  disabled={professorStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  disabled={professorStatus.state === 'loading'}
                  aria-busy={professorStatus.state === 'loading'}
                  className={`flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90 disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    professorStatus.state === 'loading' ? 'opacity-95' : ''
                  }`}
                >
                  {professorStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Professor Profile
                    </>
                  )}
                </button>
                <StatusBanner status={professorStatus} />
              </div>
            </form>
          </section>

          {/* Form 2: Post Live Project Vacancy */}
          <section className="flex flex-col rounded-xl border border-gold/20 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gold/10 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                <Briefcase className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-maroon">Post Live Project Vacancy</h2>
                <p className="text-xs text-charcoal/60">Publish an open position to the student notice board.</p>
              </div>
            </div>

            <form onSubmit={handleVacancySubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setVacancy(MOCK_VACANCY)}
                  disabled={vacancyStatus.state === 'loading'}
                  className="text-xs font-semibold text-maroon bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 rounded px-2.5 py-1 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3 h-3 text-maroon" />
                  Auto-Fill Dummy Data
                </button>
              </div>
              <div>
                <FieldLabel icon={FileText} required>
                  Project Title
                </FieldLabel>
                <input
                  name="projectTitle"
                  type="text"
                  required
                  placeholder="Deep Learning for Satellite Imagery"
                  value={vacancy.projectTitle}
                  onChange={handleVacancyChange('projectTitle')}
                  disabled={vacancyStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel icon={GraduationCap} required>
                    Professor Name
                  </FieldLabel>
                  <input
                    name="professorName"
                    type="text"
                    required
                    placeholder="Dr. Rohan Sharma"
                    value={vacancy.professorName}
                    onChange={handleVacancyChange('professorName')}
                    disabled={vacancyStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={Building2} required>
                    Department
                  </FieldLabel>
                  <select
                    name="department"
                    required
                    value={vacancy.department}
                    onChange={handleVacancyChange('department')}
                    disabled={vacancyStatus.state === 'loading'}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel icon={FileText} required>
                  Project Description
                </FieldLabel>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Briefly describe the project scope, goals, and what the student will work on..."
                  value={vacancy.description}
                  onChange={handleVacancyChange('description')}
                  disabled={vacancyStatus.state === 'loading'}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div>
                <FieldLabel icon={Users} required>
                  Eligibility
                </FieldLabel>
                <input
                  name="eligibility"
                  type="text"
                  required
                  placeholder="Y23/Y24 UI undergraduates"
                  value={vacancy.eligibility}
                  onChange={handleVacancyChange('eligibility')}
                  disabled={vacancyStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel icon={Wallet} required>
                    Stipend
                  </FieldLabel>
                  <input
                    name="stipend"
                    type="text"
                    required
                    placeholder="Unpaid / SURGE equivalent"
                    value={vacancy.stipend}
                    onChange={handleVacancyChange('stipend')}
                    disabled={vacancyStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={CalendarClock} required>
                    Application Deadline
                  </FieldLabel>
                  <input
                    name="deadline"
                    type="date"
                    required
                    value={vacancy.deadline}
                    onChange={handleVacancyChange('deadline')}
                    disabled={vacancyStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  disabled={vacancyStatus.state === 'loading'}
                  aria-busy={vacancyStatus.state === 'loading'}
                  className={`flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90 disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    vacancyStatus.state === 'loading' ? 'opacity-95' : ''
                  }`}
                >
                  {vacancyStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      Post Vacancy
                    </>
                  )}
                </button>
                <StatusBanner status={vacancyStatus} />
              </div>
            </form>
          </section>

          {/* Form 3: Add International Internship Opportunity */}
          <section className="flex flex-col rounded-xl border border-gold/20 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-gold/10 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                <Globe2 className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-maroon">Add International Internship Opportunity</h2>
                <p className="text-xs text-charcoal/60">Publish a new global internship program for prospective students.</p>
              </div>
            </div>

            <form onSubmit={handleInternshipSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setInternship(MOCK_INTERNSHIP)}
                  disabled={internshipStatus.state === 'loading'}
                  className="text-xs font-semibold text-maroon bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 rounded px-2.5 py-1 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3 h-3 text-maroon" />
                  Auto-Fill Dummy Data
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={Building2} required>
                    University Name
                  </FieldLabel>
                  <input
                    name="universityName"
                    type="text"
                    required
                    placeholder="University of Toronto"
                    value={internship.universityName}
                    onChange={handleInternshipChange('universityName')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={ClipboardList} required>
                    Program Name
                  </FieldLabel>
                  <input
                    name="internshipProgramName"
                    type="text"
                    required
                    placeholder="Mitacs, DAAD, Viterbi"
                    value={internship.internshipProgramName}
                    onChange={handleInternshipChange('internshipProgramName')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={Building2} required>
                    Country
                  </FieldLabel>
                  <input
                    name="country"
                    type="text"
                    required
                    placeholder="Canada"
                    value={internship.country}
                    onChange={handleInternshipChange('country')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={LinkIcon} required>
                    Application Link
                  </FieldLabel>
                  <input
                    name="applicationLink"
                    type="url"
                    required
                    placeholder="https://example.org/apply"
                    value={internship.applicationLink}
                    onChange={handleInternshipChange('applicationLink')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={Users}>
                    Eligibility
                  </FieldLabel>
                  <input
                    name="eligibility"
                    type="text"
                    placeholder="Third year UG"
                    value={internship.eligibility}
                    onChange={handleInternshipChange('eligibility')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={CalendarClock}>
                    Deadline
                  </FieldLabel>
                  <input
                    name="deadline"
                    type="date"
                    value={internship.deadline}
                    onChange={handleInternshipChange('deadline')}
                    disabled={internshipStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  disabled={internshipStatus.state === 'loading'}
                  aria-busy={internshipStatus.state === 'loading'}
                  className={`flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90 disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    internshipStatus.state === 'loading' ? 'opacity-95' : ''
                  }`}
                >
                  {internshipStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Globe2 className="w-4 h-4" />
                      Add Internship Opportunity
                    </>
                  )}
                </button>
                <StatusBanner status={internshipStatus} />
              </div>
            </form>
          </section>
          {/* Form 4: Publish Event or Notification */}
          <section className="flex flex-col rounded-xl border border-gold/20 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-gold/10 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                <Bell className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-maroon">Publish Event or Notification</h2>
                <p className="text-xs text-charcoal/60">Post events, notices, or urgent alerts to the student hub.</p>
              </div>
            </div>

            <form onSubmit={handleEventSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEvent(Math.random() > 0.5 ? MOCK_EVENT_FULL : MOCK_EVENT_NOTICE)}
                  disabled={eventStatus.state === 'loading'}
                  className="text-xs font-semibold text-maroon bg-maroon/5 hover:bg-maroon/10 border border-maroon/20 rounded px-2.5 py-1 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3 h-3 text-maroon" />
                  Auto-Fill Dummy Data
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={FileText} required>Title</FieldLabel>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="Research Symposium 2026"
                    value={event.title}
                    onChange={handleEventChange('title')}
                    disabled={eventStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={Tag} required>Category</FieldLabel>
                  <select
                    name="category"
                    required
                    value={event.category}
                    onChange={handleEventChange('category')}
                    disabled={eventStatus.state === 'loading'}
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
                  name="sender"
                  type="text"
                  placeholder="Research Wing, AnC"
                  value={event.sender}
                  onChange={handleEventChange('sender')}
                  disabled={eventStatus.state === 'loading'}
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel icon={ClipboardList} required>Description</FieldLabel>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe the event or notification in detail..."
                  value={event.description}
                  onChange={handleEventChange('description')}
                  disabled={eventStatus.state === 'loading'}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={CalendarClock}>Date</FieldLabel>
                  <input
                    name="date"
                    type="date"
                    value={event.date}
                    onChange={handleEventChange('date')}
                    disabled={eventStatus.state === 'loading'}
                    className={inputClasses}
                  />
                  <p className="mt-1 text-[11px] text-charcoal/50">Optional for notices.</p>
                </div>

                <div>
                  <FieldLabel icon={Clock}>Time</FieldLabel>
                  <input
                    name="time"
                    type="text"
                    placeholder="10:00 AM – 5:00 PM"
                    value={event.time}
                    onChange={handleEventChange('time')}
                    disabled={eventStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel icon={MapPin}>Venue</FieldLabel>
                  <input
                    name="venue"
                    type="text"
                    placeholder="L-20 Lecture Hall Complex"
                    value={event.venue}
                    onChange={handleEventChange('venue')}
                    disabled={eventStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <FieldLabel icon={LinkIcon}>Link</FieldLabel>
                  <input
                    name="link"
                    type="url"
                    placeholder="https://example.org/event"
                    value={event.link}
                    onChange={handleEventChange('link')}
                    disabled={eventStatus.state === 'loading'}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  disabled={eventStatus.state === 'loading'}
                  aria-busy={eventStatus.state === 'loading'}
                  className={`flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90 disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    eventStatus.state === 'loading' ? 'opacity-95' : ''
                  }`}
                >
                  {eventStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Publish Event / Notification
                    </>
                  )}
                </button>
                <StatusBanner status={eventStatus} />
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="bg-maroon text-cream py-6">
        <p className="text-center text-sm text-cream/60">
          Research Wing, Academics &amp; Careers &middot; IIT Kanpur &mdash; Admin access for wing coordinators only.
        </p>
      </footer>
    </div>
  );
}

