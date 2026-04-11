/**
 * Navigation menu configuration
 * Single source of truth for all menu items across the application
 */

import { ROUTES } from './constants';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  roles?: string[]; // If specified, only show to these roles
}

/**
 * Main navigation menu items
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: '📊',
    roles: ['learner', 'instructor', 'admin'],
  },
  {
    label: 'Courses',
    href: ROUTES.COURSES,
    icon: '📚',
    roles: ['learner', 'instructor', 'admin'],
  },
  {
    label: 'Compositions',
    href: ROUTES.COMPOSITIONS,
    icon: '✍️',
    roles: ['learner'],
  },
  {
    label: 'Evaluations',
    href: ROUTES.EVALUATIONS,
    icon: '📝',
    roles: ['learner'],
  },
  {
    label: 'Vocabulary',
    href: ROUTES.VOCABULARY,
    icon: '📖',
    roles: ['learner'],
  },
  {
    label: 'Knowledge Base',
    href: ROUTES.KNOWLEDGE,
    icon: '💡',
    roles: ['learner'],
  },
];

/**
 * Admin sidebar navigation
 */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: '📊',
  },
  {
    label: 'Content Management',
    href: ROUTES.ADMIN_CONTENT,
    icon: '📁',
    children: [
      {
        label: 'Courses',
        href: `${ROUTES.ADMIN_CONTENT}/courses`,
      },
      {
        label: 'Vocabulary',
        href: `${ROUTES.ADMIN_CONTENT}/vocabulary`,
      },
    ],
  },
  {
    label: 'Rubrics',
    href: ROUTES.ADMIN_RUBRICS,
    icon: '📋',
  },
  {
    label: 'Users',
    href: ROUTES.ADMIN_USERS,
    icon: '👥',
  },
  {
    label: 'Analytics',
    href: ROUTES.ADMIN_ANALYTICS,
    icon: '📈',
    children: [
      {
        label: 'Users',
        href: `${ROUTES.ADMIN_ANALYTICS}/users`,
      },
      {
        label: 'Performance',
        href: `${ROUTES.ADMIN_ANALYTICS}/performance`,
      },
    ],
  },
];

/**
 * User profile menu items
 */
export const PROFILE_MENU_ITEMS: NavItem[] = [
  {
    label: 'Profile',
    href: ROUTES.PROFILE,
  },
  {
    label: 'Settings',
    href: ROUTES.SETTINGS,
  },
  {
    label: 'Progress',
    href: ROUTES.PROGRESS,
  },
];

/**
 * Footer navigation items
 */
export const FOOTER_NAV_ITEMS: NavItem[] = [
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Help',
    href: '#help',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
  {
    label: 'Privacy',
    href: '#privacy',
  },
  {
    label: 'Terms',
    href: '#terms',
  },
];

/**
 * Filter navigation items by role
 */
export function filterNavItemsByRole(items: NavItem[], userRole?: string): NavItem[] {
  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) {
      return true; // No role restriction
    }
    return userRole && item.roles.includes(userRole);
  });
}
