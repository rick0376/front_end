/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: 'res.cloudinary.com',
        },
      ],
    },
    experimental: {
      runtime: 'nodejs', // Força o uso do Node.js Runtime
    },
  };
  
  module.exports = nextConfig;
  