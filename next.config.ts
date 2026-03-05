import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // Turbopack configuration (Dành cho lệnh dev --turbopack)
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },

    // Optimize build performance
    typescript: {
        ignoreBuildErrors: false,
    },

    // Webpack configuration (Dành cho lệnh build)
    webpack(config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"))

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
                use: ["@svgr/webpack"],
            },
        )

        fileLoaderRule.exclude = /\.svg$/i

        return config
    },

    // Image configuration
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            }
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
}

export default nextConfig