

const basePath = process.env.BACKEND_BASE_URL
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/auth/:path*',
                destination: `${basePath}/auth/:path*`,
            },
            {
                source: '/api/:path*',
                destination: `${basePath}/api/:path*`,
            },
        ]
    },
};

export default nextConfig;
