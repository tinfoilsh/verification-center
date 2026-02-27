/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname),
  generateBuildId: async () => {
    return "build-repro";
  },
  output: "export",
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
