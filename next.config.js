const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://plant-shop-api.vercel.app/:path*", // Proxy to Backend
//       },
//     ];
//   },
// };

module.exports = withBundleAnalyzer(
  withPlaiceholder({
    compiler: {
      styledComponents: true,
    },
    images: {
      domains: ["res.cloudinary.com", "localhost"],
    },
    ...nextConfig,
  })
);
