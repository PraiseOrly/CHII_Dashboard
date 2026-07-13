/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async redirects() {
    return [
      // "Field Visits" was renamed to "Study Trips" — keep the old URL working.
      { source: "/hent/fieldvisits", destination: "/hent/study-trips", permanent: true },
    ];
  },
};

export default nextConfig;
