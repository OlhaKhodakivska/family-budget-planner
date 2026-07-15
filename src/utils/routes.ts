import type { DashboardSection } from '../types/budget';

const sectionPaths: Record<DashboardSection, string> = {
  overview: '/',
  income: '/income',
  expenses: '/expenses',
  cards: '/cards',
  savings: '/savings',
  dreams: '/dreams',
};

const validSections = new Set<DashboardSection>(Object.keys(sectionPaths) as DashboardSection[]);

export interface DashboardRoute {
  section: DashboardSection;
  goalId: string | null;
}

export const getRouteFromHash = (hash: string): DashboardRoute => {
  const path = hash.replace(/^#/, '').trim();
  const segments = path.split('/').filter(Boolean);
  const section = segments[0] as DashboardSection | undefined;

  if (!section || !validSections.has(section)) {
    return { section: 'overview', goalId: null };
  }

  return {
    section,
    goalId: section === 'dreams' && segments[1] ? decodeURIComponent(segments[1]) : null,
  };
};

export const getHashForSection = (section: DashboardSection, goalId?: string | null): string => {
  if (section === 'dreams' && goalId) {
    return `#/dreams/${encodeURIComponent(goalId)}`;
  }

  return `#${sectionPaths[section]}`;
};
