const child_process = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname),
  output: 'export',

  // Improve reproducibility of builds
  generateBuildId: async () => {
    if (process.env.GIT_HASH != null && process.env.GIT_HASH !== '') {
      return process.env.GIT_HASH;
    }

    const commitId = child_process.execSync('git rev-parse HEAD').toString().trim();
    return commitId;
  }
}

module.exports = nextConfig
