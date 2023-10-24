/** @type {import('next').NextConfig} */

const webpack = (config, { webpack }) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        readline: false,
        util: false
    };

    return config;
};

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    }
};

module.exports = nextConfig;