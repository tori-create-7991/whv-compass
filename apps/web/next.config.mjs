/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the workspace contracts package from source.
  transpilePackages: ["@whv-compass/shared"],
};

export default nextConfig;
