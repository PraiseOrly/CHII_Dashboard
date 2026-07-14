// Navigation — the single source of truth for every portal's routes and labels.
// Adding a page means adding one entry here; the nav renders itself.

import type { Portal } from "@/theme/portals";

export interface NavItem {
  label: string;
  href: string;
}

export interface PortalNavConfig {
  /** Large wordmark in the nav, e.g. "HENT". */
  wordmark: string;
  /** Stacked lines beside the wordmark. */
  wordmarkLines: string[];
  /** The portal's index route. */
  rootHref: string;
  items: NavItem[];
}

export const PORTAL_NAVS: Record<Portal, PortalNavConfig> = {
  hent: {
    wordmark: "HENT",
    wordmarkLines: ["HEALTH", "ENTREPRENEURSHIP", "PILLAR"],
    rootHref: "/hent/overview",
    items: [
      { label: "Overview",              href: "/hent/overview" },
      { label: "Ventures",              href: "/hent/ventures" },
      { label: "Venture Funding",       href: "/hent/venture-funding" },
      { label: "Masterclass",           href: "/hent/masterclasses" },
      { label: "Hackathon",             href: "/hent/hackathons" },
      { label: "Mentorship",            href: "/hent/mentorship" },
      { label: "Exposure & Networking", href: "/hent/exposure-networking" },
      { label: "Study Trips",           href: "/hent/study-trips" },
    ],
  },

  hemp: {
    wordmark: "HEMP",
    wordmarkLines: ["HEALTH", "EMPLOYMENT", "PILLAR"],
    rootHref: "/hemp",
    items: [
      { label: "Overview",                       href: "/hemp" },
      { label: "Internship",                     href: "/hemp/internships" },
      { label: "Signature Immersive Experience", href: "/hemp/sie" },
      { label: "HealthX: Explore What's Next",   href: "/hemp/healthx" },
      { label: "Mission Students",               href: "/hemp/mission-students" },
    ],
  },

  heco: {
    wordmark: "HECO",
    wordmarkLines: ["HEALTH", "ECOSYSTEMS", "PILLAR"],
    rootHref: "/heco",
    items: [
      { label: "Overview", href: "/heco" },
      { label: "CRA",      href: "/heco/cra" },
    ],
  },

  executive: {
    wordmark: "CHII",
    wordmarkLines: ["EXECUTIVE", "IMPACT", "DASHBOARD"],
    rootHref: "/executive",
    items: [
      { label: "Overview", href: "/executive" },
    ],
  },
};
