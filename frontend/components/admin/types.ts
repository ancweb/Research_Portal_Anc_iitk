// ---------------------------------------------------------------------------
// Shared types, constants, and empty/mock data for the Admin panel forms.
// ---------------------------------------------------------------------------

export const DEPARTMENTS = [
  'AE', 'BSBE', 'CHE', 'CE', 'CSE', 'EE', 'MSE', 'ME',
  'CHM', 'ES', 'ECO', 'MTH', 'PHY', 'SDS', 'CGS', 'DES', 'IME', 'SEE',
];

// ── Form data shapes ────────────────────────────────────────────────────────

export type ProfessorForm = {
  name: string;
  department: string;
  researchInterests: string;
  email: string;
  labWebsite: string;
};

export type VacancyForm = {
  projectTitle: string;
  professorName: string;
  department: string;
  description: string;
  eligibility: string;
  stipend: string;
  deadline: string;
};

export type InternshipForm = {
  universityName: string;
  internshipProgramName: string;
  country: string;
  applicationLink: string;
  eligibility: string;
  deadline: string;
};

export type EventForm = {
  title: string;
  sender: string;
  category: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  link: string;
};

// ── Status helper ────────────────────────────────────────────────────────────

export type Status = {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

export const IDLE_STATUS: Status = { state: 'idle', message: '' };

// ── Empty form defaults ──────────────────────────────────────────────────────

export const EMPTY_PROFESSOR: ProfessorForm = {
  name: '',
  department: '',
  researchInterests: '',
  email: '',
  labWebsite: '',
};

export const EMPTY_VACANCY: VacancyForm = {
  projectTitle: '',
  professorName: '',
  department: '',
  description: '',
  eligibility: '',
  stipend: 'Unpaid / SURGE equivalent',
  deadline: '',
};

export const EMPTY_INTERNSHIP: InternshipForm = {
  universityName: '',
  internshipProgramName: '',
  country: '',
  applicationLink: '',
  eligibility: '',
  deadline: '',
};

export const EMPTY_EVENT: EventForm = {
  title: '',
  sender: 'Research Wing, AnC',
  category: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  link: '',
};

// ── Mock / auto-fill data ────────────────────────────────────────────────────

export const MOCK_PROFESSOR: ProfessorForm = {
  name: 'Dr. Amit Sharma',
  department: 'CSE',
  researchInterests: 'Machine Learning, Computer Vision, Deep Learning',
  email: 'amit.sharma@iitk.ac.in',
  labWebsite: 'https://lab.iitk.ac.in/ml',
};

export const MOCK_VACANCY: VacancyForm = {
  projectTitle: 'Autonomous Drone Path Planning',
  professorName: 'Dr. Amit Sharma',
  department: 'CSE',
  description:
    'Looking for enthusiastic undergraduate students to work on path planning and collision avoidance algorithms for autonomous drones using ROS and deep reinforcement learning.',
  eligibility: 'Y23/Y24 B.Tech/Dual Degree students with strong python/C++ programming skills.',
  stipend: 'SURGE equivalent / ₹10,000 per month',
  deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

export const MOCK_INTERNSHIP: InternshipForm = {
  universityName: 'University of Toronto',
  internshipProgramName: 'Mitacs Globalink Research Internship',
  country: 'Canada',
  applicationLink: 'https://www.mitacs.ca/en/programs/globalink/globalink-research-internship',
  eligibility: 'Pre-final year undergraduate students (3rd year B.Tech/4th year Dual Degree).',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

export const MOCK_EVENT_FULL: EventForm = {
  title: 'Research Symposium 2026 — Student Presentations',
  sender: 'Research Wing, AnC',
  category: 'Event',
  description:
    'Annual research symposium showcasing undergraduate and postgraduate research projects. Includes poster presentations, lightning talks, and a keynote by a distinguished alumnus. Open to all students and faculty.',
  date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  time: '10:00 AM – 5:00 PM',
  venue: 'L-20 Lecture Hall Complex, IIT Kanpur',
  link: 'https://iitk.ac.in/research-symposium-2026',
};

export const MOCK_EVENT_NOTICE: EventForm = {
  title: 'SURGE 2026 Applications Now Open',
  sender: 'Dean of Research, IIT Kanpur',
  category: 'Notice',
  description:
    'Applications for the Summer Undergraduate Research Grant for Excellence (SURGE) 2026 are now open. Eligible students from Y23/Y24 batches across all departments can apply. Last date to submit the online form is July 30, 2026. For details, visit the SURGE portal or contact your department coordinator.',
  date: '',
  time: '',
  venue: '',
  link: 'https://surge.iitk.ac.in',
};
