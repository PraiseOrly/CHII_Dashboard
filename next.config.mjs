/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async redirects() {
    return [
      // "Field Visits" was renamed to "Study Trips" — keep the old URL working.
      { source: "/hent/fieldvisits", destination: "/hent/study-trips", permanent: true },

      // "Intro to Global Health" is now a section of Mission Students.
      { source: "/hemp/global-health", destination: "/hemp/mission-students", permanent: true },

      // The "Impact" portal is now called "Executive". The three per-pillar
      // sub-pages under it were unreachable and have been removed, so they land
      // on the executive overview instead.
      { source: "/impact/:pillar(hent|hemp|heco)", destination: "/executive", permanent: true },
      { source: "/impact", destination: "/executive", permanent: true },
      { source: "/impact/:path*", destination: "/executive/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
