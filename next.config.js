/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
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
        hostname: "img.clerk.com", 
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com", 
        pathname: "/maps/api/place/photo",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", 
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
