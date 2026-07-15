/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel Next.js runtime (not a static /out export). Route handlers,
  // server rendering, and next/image optimization run on the Vercel runtime.
  // NOTE: `output: "export"` and `images.unoptimized` were removed in
  // Production Patch 01 — see docs/production-runtime-foundation-p01.md.
  //
  // Preserve existing directory-style URLs (e.g. /about/) so no public URL
  // changes when moving off the static export.
  trailingSlash: true,
  // Do not advertise the framework in the X-Powered-By response header.
  poweredByHeader: false,
};

export default nextConfig;
