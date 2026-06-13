/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: removed `output: "export"` — Clerk auth needs a running server
  // (Server Actions). Vercel runs Next.js as a server natively, so this is fine.
  images: { unoptimized: true },
};
export default nextConfig;
