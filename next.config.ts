import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        // Prevents your site being embedded in iframes on other domains
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        // Stops browsers guessing content types
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Controls how much referrer info is sent
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Removes Vercel/Next.js fingerprinting header
        { key: "X-Powered-By", value: "" },
        // Controls browser features your site uses
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        // Basic XSS protection for older browsers
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ],
    },
  ],
};

export default nextConfig;