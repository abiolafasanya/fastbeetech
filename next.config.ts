import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      new URL("https://drive.google.com/file/d/**"),
    ],
  },
};

export default nextConfig;
