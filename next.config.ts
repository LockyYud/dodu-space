import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Handled in the routing layer, not by a page.
      //
      // /ielts/journey used to be a page whose whole body was redirect().
      // With no data fetching it was prerendered at build time, so a
      // client-side navigation received HTTP 200 plus an error-boundary RSC
      // payload instead of a redirect, and the app crashed in the browser.
      // A config redirect never involves React at all.
      {
        source: "/ielts/journey",
        destination: "/ielts/history",
        permanent: false,
      },
      // The Craft page was retired in the editorial redesign; its three
      // visuals said less than the About page's own text.
      {
        source: "/craft",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
