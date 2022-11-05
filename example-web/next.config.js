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
    webpack
};

module.exports = nextConfig;
