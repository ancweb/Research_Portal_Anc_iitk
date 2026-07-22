'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Briefcase, Globe2, Bell, Loader2, LogOut } from 'lucide-react';
import PortalNavbar from '@/components/portal-navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AddProfessorForm from '@/components/admin/AddProfessorForm';
import PostVacancyForm from '@/components/admin/PostVacancyForm';
import AddInternshipForm from '@/components/admin/AddInternshipForm';
import PublishEventForm from '@/components/admin/PublishEventForm';


const TABS = [
  { value: 'professor',   label: 'Add Professor',  icon: UserPlus,  short: 'Professor' },
  { value: 'vacancy',     label: 'Post Vacancy',   icon: Briefcase, short: 'Vacancy'   },
  { value: 'internship',  label: 'Internship',     icon: Globe2,    short: 'Internship'},
  { value: 'event',       label: 'Event / Notice', icon: Bell,      short: 'Event'     },
] as const;

type TabValue = (typeof TABS)[number]['value'];


export default function AdminPanelPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('professor');


  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/portal/admin/login');
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, {
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
  }, [router, API_BASE]);


  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleAuthError = (res: Response): boolean => {
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


  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  const formProps = { apiBase: API_BASE, getAuthHeaders, onAuthError: handleAuthError };

  return (
    <div className="min-h-screen bg-cream">
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

      <div className="border-b border-gold/20 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-bold text-maroon sm:text-2xl">Manage Portal Data</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Add faculty profiles, post vacancies, and publish events for students.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
          className="gap-0"
        >
          <div className="mb-6 overflow-x-auto">
            <TabsList className="h-auto w-full min-w-max rounded-xl border border-gold/20 bg-white p-1 shadow-sm">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-8 py-2.5 text-md font-medium text-charcoal/60 transition-colors hover:text-maroon data-[state=active]:bg-maroon data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="professor">
            <AddProfessorForm {...formProps} />
          </TabsContent>

          <TabsContent value="vacancy">
            <PostVacancyForm {...formProps} />
          </TabsContent>

          <TabsContent value="internship">
            <AddInternshipForm {...formProps} />
          </TabsContent>

          <TabsContent value="event">
            <PublishEventForm {...formProps} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-maroon text-cream py-6">
        <p className="text-center text-sm text-cream/60">
          Research Wing, Academics &amp; Careers &middot; IIT Kanpur &mdash; Admin access for wing coordinators only.
        </p>
      </footer>
    </div>
  );
}
