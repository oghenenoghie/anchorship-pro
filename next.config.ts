import type { NextConfig } from "next";
// GitHub Codespaces serves the app from https://<codespace>-<port>.<forwarding domain> while Next.js sees localhost, so
// Server Actions (sign-out, change password) would be refused as cross-origin. Inside a codespace only, trust exactly
// that codespace's forwarded address; everywhere else (including Vercel) no extra origin is allowed.
const env = process.env;
const codespaceOrigin = env.CODESPACES === "true" && env.CODESPACE_NAME && env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ? `${env.CODESPACE_NAME}-${env.PORT ?? "3000"}.${env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  : null;
const nextConfig: NextConfig = {
  images: { remotePatterns: [ { protocol: "https", hostname: "images.unsplash.com" } ] },
  ...(codespaceOrigin && { allowedDevOrigins: [codespaceOrigin], experimental: { serverActions: { allowedOrigins: [codespaceOrigin] } } }),
};
export default nextConfig;
