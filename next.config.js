/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname),
  generateBuildId: async () => {
    return "build-repro";
  }
}

module.exports = nextConfig
