/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '74.50.127.200',
            port: '9000',
            pathname: '/portfolio/**',
          },
        ],
      },
};

export default nextConfig;
