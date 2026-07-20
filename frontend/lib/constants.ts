export const COLORS = {
  maroon: '#6E1423',
  gold: '#C9A24B',
  charcoal: '#2C2C2C',
  slate: '#5A6B7A',
  cream: '#F5F1ED',
} as const

export const NAVIGATION = [
  { label: 'Research Journey', href: '#research-journey' },
  { label: 'Lab Tours', href: '#lab-tours' },
  { label: 'PhD & Masters', href: '#phd-masters' },
  { label: 'Research 101', href: '#research-101' },
  { label: 'CV Making', href: '#cv-making' },
  { label: 'Contact', href: '#contact' },
] as const

export const CONTACT_METHODS = [
  {
    type: 'Email',
    value: 'research@iitk.ac.in',
  },
  {
    type: 'LinkedIn',
    value: 'Research Wing IITK',
  },
  {
    type: 'Instagram',
    value: '@iitk_research_wing',
  },
] as const
