const nextConfig = {
  webpack: (config: { watchOptions: any }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "C:/pagefile.sys",
        "C:/swapfile.sys",
        "C:/hiberfil.sys",
        "C:/DumpStack.log.tmp",
      ],
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
