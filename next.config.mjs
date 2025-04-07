/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iiurktvofisffmqdjond.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/emded",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src  'self'  https://vinaykumar.created.app;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
