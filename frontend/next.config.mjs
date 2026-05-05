/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is enabled by default in Next.js 13+
  // experimental: {
  //   appDir: true,
  // },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
};

export default nextConfig;
