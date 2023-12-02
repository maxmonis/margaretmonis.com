/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.datocms-assets.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
}

module.exports = nextConfig
