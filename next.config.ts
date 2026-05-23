import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || process.env.PWA_ENABLED !== "1",
  register: true,
  customWorkerSrc: "worker",
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
};

export default withPWA(nextConfig);
