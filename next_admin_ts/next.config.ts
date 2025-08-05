import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  sassOptions: {
    implementation: "sass-embedded",
  },
};

export default nextConfig;
