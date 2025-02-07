module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend.dex.fawaka.xyz/api/:path*",
      },
    ];
  },
};
