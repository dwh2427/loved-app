/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com", "upload.wikimedia.org", "i.ibb.co"],
  },
  reactStrictMode: true,
};

export default nextConfig;
