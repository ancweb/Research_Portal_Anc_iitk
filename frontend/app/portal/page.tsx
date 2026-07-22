'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  GraduationCap,
  Bell,
  ChevronRight,
  Clock,
  Mail,
  ExternalLink,
  FileText,
  BookOpen,
  Lightbulb,
  Filter,
  Calendar,
  Loader2,
  Wallet,
} from 'lucide-react';

import {
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PortalNavbar from '@/components/portal-navbar';


interface Professor {
  _id: string;
  name: string;
  email: string;
  department: string;
  department_id?: string;
  designation?: string | null;
  researchInterests?: string[];
  research_interests?: string[];
  labWebsite?: string;
  is_accepting_students?: boolean;
  // Legacy Supabase fields (in case of mixed data)
  id?: string;
  departments?: { id: string; name: string; code: string };
  profile_image_url?: string | null;
  google_scholar_url?: string | null;
}

interface ProjectVacancy {
  _id: string;
  projectTitle?: string;
  title?: string;
  professorName?: string;
  department?: string;
  description?: string;
  eligibility?: string;
  stipend?: string;
  deadline?: string | null;
  is_active?: boolean;
  // Legacy Supabase fields (in case of mixed data)
  id?: string;
  lab_id?: string;
  professor_id?: string;
  requirements?: string[] | null;
  duration?: string | null;
  spots_available?: number;
  labs?: { name: string; departments?: { code: string } };
  professors?: { name: string; email: string };
}

/* Helper to get a unique key  */
function getKey(item: { _id?: string; id?: string }, idx: number): string {
  return item._id || item.id || String(idx);
}

/*  Helper to extract department code  */
function getProfDept(prof: Professor): string {
  return prof.departments?.code || prof.department || prof.department_id || 'N/A';
}

function getVacDept(vac: ProjectVacancy): string {
  return vac.labs?.departments?.code || vac.department || 'N/A';
}

/*  Helper to extract research interests  */
function getResearchInterests(prof: Professor): string[] {
  return prof.research_interests ?? prof.researchInterests ?? [];
}

/*  Helper to extract vacancy title  */
function getVacTitle(vac: ProjectVacancy): string {
  return vac.title || vac.projectTitle || 'Untitled Project';
}

/*  Helper to extract professor name for vacancy  */
function getVacProfessor(vac: ProjectVacancy): string {
  return vac.professors?.name || vac.professorName || '';
}

function getVacProfessorEmail(vac: ProjectVacancy): string {
  return vac.professors?.email || '';
}

export default function PortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [vacancies, setVacancies] = useState<ProjectVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [profResp, vacResp] = await Promise.all([
          fetch(`${API_BASE_URL}/api/professors`),
          fetch(`${API_BASE_URL}/api/vacancies`),
        ]);

        const profJson = await profResp.json();
        const vacJson = await vacResp.json();

        const professorsData: Professor[] = Array.isArray(profJson)
          ? profJson
          : profJson.data ?? profJson.professors ?? [];

        const vacanciesData: ProjectVacancy[] = Array.isArray(vacJson)
          ? vacJson
          : vacJson.data ?? vacJson.vacancies ?? [];

        setProfessors(professorsData);
        setVacancies(vacanciesData);
      } catch (error) {
        console.error('Failed to load portal data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /*  Derive unique departments from professors  */
  const departmentCodes = Array.from(
    new Set(professors.map((p) => getProfDept(p)).filter((d) => d && d !== 'N/A')),
  ).sort();


  const filteredProfessors = professors.filter((prof) => {
    const q = searchQuery.toLowerCase();
    const interests = getResearchInterests(prof);
    const matchesSearch =
      prof.name.toLowerCase().includes(q) ||
      prof.email.toLowerCase().includes(q) ||
      interests.some((i) => i.toLowerCase().includes(q));
    const dept = getProfDept(prof);
    const matchesDept = selectedDepartment === 'all' || dept === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const filteredVacancies = vacancies.filter((vac) => {
    const q = searchQuery.toLowerCase();
    const title = getVacTitle(vac);
    const matchesSearch =
      title.toLowerCase().includes(q) ||
      (vac.description?.toLowerCase().includes(q) ?? false) ||
      (vac.professorName?.toLowerCase().includes(q) ?? false);
    const dept = getVacDept(vac);
    const matchesDept = selectedDepartment === 'all' || dept === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-cream">
      <PortalNavbar title="Research Portal" backHref="/" backLabel="Back to Home" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl bg-maroon p-7 sm:p-10 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Research Wing · IIT Kanpur</p>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Research Student Dashboard</h1>
              <p className="text-white/75 text-sm max-w-xl leading-relaxed">
                Explore professors, labs, and live project opportunities. Your gateway to research excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/portal/events">
                <Button className="bg-gold text-charcoal hover:bg-gold/90 font-bold w-full sm:w-auto rounded-full px-12">
                  Events &amp; Notices
                </Button>
              </Link>
              <Link href="/international-internships">
                <Button className="bg-white/15 text-white border border-white/25 hover:bg-white/25 w-full sm:rounded-full px-12">
                  International Internships
                </Button>
              </Link>
              <Link href="/portal/admin">
                <Button className="bg-white/15 text-white border border-white/25 hover:bg-white/25 w-full rounded-full px-12">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
            <Input
              placeholder="Search professors, projects, interests…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gold/30 focus:border-maroon text-charcoal placeholder:text-charcoal/40 rounded-lg"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v ?? 'all')}>
            <SelectTrigger className="w-full sm:w-48 h-11 bg-white border-gold/30 rounded-lg text-charcoal">
              <Filter className="mr-2 h-4 w-4 text-charcoal/50 shrink-0" />
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentCodes.map((code) => (
                <SelectItem key={code} value={code}>{code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Tabs */}
        {/* <Tabs value={activeTab} onValueChange={(v) => { if (v) setActiveTab(v) }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gold/20 rounded-xl p-1 h-auto shadow-sm">
            <TabsTrigger value="directory" className="py-2.5 text-sm font-medium rounded-lg">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Professor </span>Directory
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="py-2.5 text-sm font-medium rounded-lg ">
              <Bell className="mr-2 h-4 w-4" />
              Notice Board
              {filteredVacancies.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">{filteredVacancies.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resources" className="py-2.5 text-sm font-medium rounded-lg ">
              <BookOpen className="mr-2 h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>
 */}
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { if (v) setActiveTab(v) }} className="space-y-12">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-white border border-gold/20 rounded-xl shadow-sm">

            
            <TabsTrigger
              value="directory"
              className="py-3 text-sm h-full font-medium rounded-lg transition-all text-slate-600 data-[state=active]:bg-maroon data-[state=active]:text-cream data-[state=active]:shadow-sm"
            >
              <Users className="mr-2 h-4 w-4 shrink-0" />
              <span className="hidden sm:inline mr-1">Professor</span>
              <span>Directory</span>
            </TabsTrigger>

      
            <TabsTrigger
              value="vacancies"
              className="py-3 text-sm h-full font-medium rounded-lg transition-all text-slate-600 data-[state=active]:bg-maroon data-[state=active]:text-cream data-[state=active]:shadow-sm relative flex items-center justify-center"
            >
              <Bell className="mr-2 h-4 w-4 shrink-0" />
              <span>Notice Board</span>
              {filteredVacancies.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0">
                  {filteredVacancies.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="resources"
              className="py-3 text-m h-full font-medium rounded-lg transition-all text-slate-600 data-[state=active]:bg-maroon data-[state=active]:text-cream data-[state=active]:shadow-sm"
            >
              <BookOpen className="mr-2 h-4 w-4 shrink-0" />
              <span>Resources</span>
            </TabsTrigger>

          </TabsList>
          <TabsContent value="directory">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-7 w-7 animate-spin text-maroon" />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <GraduationCap className="h-5 w-5 text-maroon" />
                  <h2 className="text-lg font-semibold text-charcoal">
                    Professors
                    <span className="ml-2 text-sm font-normal text-charcoal/50">({filteredProfessors.length})</span>
                  </h2>
                </div>

                {filteredProfessors.length === 0 ? (
                  <div className="rounded-xl border border-gold/20 bg-white p-12 text-center">
                    <GraduationCap className="h-10 w-10 mx-auto text-charcoal/20 mb-3" />
                    <p className="font-medium text-charcoal mb-1">No professors found</p>
                    <p className="text-sm text-charcoal/50">Try adjusting your search or department filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProfessors.map((professor, idx) => {
                      const interests = getResearchInterests(professor);
                      const dept = getProfDept(professor);
                      const initials = professor.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

                      return (
                        <div
                          key={getKey(professor, idx)}
                          className="bg-white rounded-xl border border-gold/20 p-5 hover:shadow-md hover:border-gold/40 transition-all duration-200 flex flex-col gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-maroon flex items-center justify-center text-cream font-bold text-sm shrink-0">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-charcoal truncate">{professor.name}</h3>
                              {professor.designation && (
                                <p className="text-xs text-charcoal/50 mt-0.5">{professor.designation}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-maroon border border-gold/20">
                                  {dept}
                                </span>
                                {professor.is_accepting_students ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                    Accepting Students
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-charcoal/5 px-2.5 py-0.5 text-xs text-charcoal/50 border border-charcoal/10">
                                    Not Accepting
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {interests.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {interests.slice(0, 3).map((interest, i) => (
                                <span key={i} className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-charcoal/70 border border-gold/15">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="space-y-1.5 text-sm text-charcoal/60 border-t border-gold/10 pt-3">
                            <a href={`mailto:${professor.email}`} className="flex items-center gap-2 hover:text-maroon transition-colors truncate">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{professor.email}</span>
                            </a>
                            {professor.labWebsite && (
                              <a href={professor.labWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-maroon transition-colors">
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                <span>Lab Website</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </TabsContent>


          <TabsContent value="vacancies">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-maroon" />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-5 w-5 text-maroon" />
                    Live Project Vacancies ({filteredVacancies.length})
                  </h2>
                </div>

                {filteredVacancies.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No Active Vacancies</h3>
                    <p className="text-muted-foreground">Check back later for new opportunities.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {filteredVacancies.map((vacancy, idx) => {
                      const title = getVacTitle(vacancy);
                      const profName = getVacProfessor(vacancy);
                      const profEmail = getVacProfessorEmail(vacancy);
                      const dept = getVacDept(vacancy);
                      const daysLeft = vacancy.deadline
                        ? Math.max(
                          0,
                          Math.ceil(
                            (new Date(vacancy.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                          ),
                        )
                        : null;

                      return (
                        <Card
                          key={getKey(vacancy, idx)}
                          className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
                            {daysLeft !== null && (
                              <Badge
                                className={`${daysLeft <= 7
                                    ? 'bg-red-500'
                                    : daysLeft <= 14
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  } text-white shrink-0`}
                              >
                                {daysLeft} days left
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-3">
                            {/* Professor & Department */}
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                              {profName && (
                                <>
                                  <GraduationCap className="h-4 w-4 text-maroon" />
                                  <span className="text-foreground font-medium">{profName}</span>
                                </>
                              )}
                              {dept !== 'N/A' && (
                                <Badge variant="secondary" className="text-xs bg-gold/10 text-maroon border-gold/20">
                                  {dept}
                                </Badge>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {vacancy.description}
                            </p>

                            {/* Eligibility */}
                            {vacancy.eligibility && (
                              <div className="flex items-start gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Eligibility:</span>{' '}
                                  {vacancy.eligibility}
                                </span>
                              </div>
                            )}

                            {/* Requirements (legacy data) */}
                            {vacancy.requirements && vacancy.requirements.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {vacancy.requirements.slice(0, 4).map((req, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Meta row */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground pt-2 border-t">
                              {vacancy.stipend && (
                                <div className="flex items-center gap-1.5">
                                  <Wallet className="h-4 w-4" />
                                  <span>{vacancy.stipend}</span>
                                </div>
                              )}
                              {vacancy.duration && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  <span>Duration: {vacancy.duration}</span>
                                </div>
                              )}
                              {vacancy.spots_available != null && (
                                <div className="flex items-center gap-1.5">
                                  <Users className="h-4 w-4" />
                                  <span>Spots: {vacancy.spots_available}</span>
                                </div>
                              )}
                              {vacancy.deadline && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>Deadline: {new Date(vacancy.deadline).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>

                            {/* Contact professor */}
                            {profEmail && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-muted-foreground mb-1">Contact Professor:</p>
                                <a
                                  href={`mailto:${profEmail}`}
                                  className="text-sm text-maroon hover:underline flex items-center gap-1.5"
                                >
                                  <Mail className="h-4 w-4" />
                                  {profName}
                                </a>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Resource Corner */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Cold Email Guide */}
              <Card className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-maroon to-maroon/70 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">How to Write Cold Emails to Professors</h3>
                    <p className="text-sm text-muted-foreground">A comprehensive guide for effective outreach</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-maroon text-white text-xs flex items-center justify-center">1</span>
                      Subject Line Matters
                    </h4>
                    <p className="text-sm text-muted-foreground pl-8">
                      Keep it concise and specific. Include your purpose and key identifier (e.g., year/department).
                    </p>
                    <div className="pl-8 mt-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                        &quot;SURGE 2024 Application - B.Tech CSE 3rd Year - [Your Name]&quot;
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-maroon text-white text-xs flex items-center justify-center">2</span>
                      Show You&apos;ve Done Your Homework
                    </h4>
                    <p className="text-sm text-muted-foreground pl-8">
                      Reference specific papers or projects from their work. Explain why it interests you.
                    </p>
                    <div className="pl-8 mt-2 p-3 bg-muted rounded-lg border">
                      <p className="text-xs font-medium text-foreground mb-1">Example:</p>
                      <p className="text-xs text-muted-foreground italic">
                        &quot;I recently read your paper on &apos;Deep Reinforcement Learning for Robotics&apos; and found the approach to sample efficiency particularly compelling. I&apos;m excited about extending this work to...&quot;
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-maroon text-white text-xs flex items-center justify-center">3</span>
                      Clear Ask, Minimal Commitment
                    </h4>
                    <p className="text-sm text-muted-foreground pl-8">
                      Be specific about what you want (meeting, project discussion, SURGE guidance). Offer flexibility.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-maroon text-white text-xs flex items-center justify-center">4</span>
                      Attach Relevant Documents
                    </h4>
                    <p className="text-sm text-muted-foreground pl-8">
                      Include CV, transcript, and a brief SOP if applying for a specific position.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-maroon text-white text-xs flex items-center justify-center">5</span>
                      Professional Closing
                    </h4>
                    <p className="text-sm text-muted-foreground pl-8">
                      Keep it brief but polite. Follow up after 1-2 weeks if no response.
                    </p>
                  </div>
                </div>
              </Card>

              {/* CV Structure Guide */}
              <Card className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Academic CV Structure</h3>
                    <p className="text-sm text-muted-foreground">Standard format for research applications</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-maroon/5 to-gold/5 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-maroon" />
                      Header Section
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                      <li>Full Name (prominent, larger font)</li>
                      <li>Contact: Email, Phone, LinkedIn, Google Scholar</li>
                      <li>Current Position/Affiliation</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-maroon/5 to-gold/5 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-maroon" />
                      Education (Reverse Chronological)
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                      <li>Degree, Institution, Year</li>
                      <li>CGPA/Percentage (if strong)</li>
                      <li>Relevant coursework (optional)</li>
                      <li>Thesis/Project title (if applicable)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-maroon/5 to-gold/5 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-maroon" />
                      Research Experience
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                      <li>Project title, Role, Duration</li>
                      <li>Advisor/Supervisor name</li>
                      <li>Brief description (2-3 lines)</li>
                      <li>Key outcomes, publications, tools used</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-maroon/5 to-gold/5 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-maroon" />
                      Publications (if any)
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                      <li>Use standard citation format</li>
                      <li>Mark submitted/under review clearly</li>
                      <li>Include DOOs/links</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-maroon/5 to-gold/5 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-maroon" />
                      Additional Sections
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                      <li>Technical Skills (categorized)</li>
                      <li>Awards & Honors</li>
                      <li>Teaching/Tutoring Experience</li>
                      <li>Leadership & Extracurriculars</li>
                      <li>References (2-3 professors)</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Pro Tips</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>Keep CV to 1-2 pages for undergrad applications</li>
                        <li>Use consistent formatting throughout</li>
                        <li>Quantify achievements where possible</li>
                        <li>Tailor CV for each position/lab</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <BookOpen className="h-8 w-8 text-maroon mb-4" />
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-maroon transition-colors">
                  SOP Writing Guide
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to craft compelling statements of purpose for graduate applications.
                </p>
              </Card>

              <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <GraduationCap className="h-8 w-8 text-maroon mb-4" />
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-maroon transition-colors">
                  PhD Application Timeline
                </h3>
                <p className="text-sm text-muted-foreground">
                  Month-by-month guide for PhD applications to US, Europe, and India.
                </p>
              </Card>

              <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <Users className="h-8 w-8 text-maroon mb-4" />
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-maroon transition-colors">
                  Letter of Recommendation Guide
                </h3>
                <p className="text-sm text-muted-foreground">
                  How to request strong recommendation letters from professors.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-maroon text-cream mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cream/60">
              © 2026 Research Wing, AnC, IIT Kanpur
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/research-wing-anc-iitk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-gold transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/iitk_research_wing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-gold transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@ResearchWingAnCIIT-Kanpur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-gold transition-colors"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

