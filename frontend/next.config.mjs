/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8527/:path*' // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;
