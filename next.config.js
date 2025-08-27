/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.chartedconsultants.com',
                port: "",
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com',
                pathname: '/**',
            }
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(mp4|webm)$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next/static/media/',
                    outputPath: 'static/media/',
                    name: '[name].[hash].[ext]',
                },
            },
        });
        return config;
    },
};

module.exports = nextConfig;
  