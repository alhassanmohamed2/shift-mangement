/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8527/:path*' // Proxy to Backend container
      }
    ]
  }
};

export default nextConfig;
