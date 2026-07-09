import type { NextConfig } from "next";

/* eslint-disable @typescript-eslint/no-require-imports */
type WebpackLike = {
  DefinePlugin: new (definitions: Record<string, string>) => unknown;
};

const webpack = require("webpack") as WebpackLike;

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
          process.env.VITE_API_BASE_URL || "",
        ),
      }),
    );

    return config;
  },
};

export default nextConfig;
