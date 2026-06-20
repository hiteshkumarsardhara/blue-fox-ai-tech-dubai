import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3"],
  experimental: {
    // KYC document uploads (ID photos) can be several MB each; the default
    // Server Action body limit is 1MB, which would reject them. A submission
    // can carry up to 3 files at 8MB each (see saveKycFiles), so allow headroom.
    serverActions: {
      bodySizeLimit: "28mb",
    },
  },
};

export default nextConfig;
