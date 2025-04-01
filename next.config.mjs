/** @type {import('next').NextConfig} */
const nextConfig = {
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
