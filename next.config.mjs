/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — `next build` emits a fully static site into /out.
  output: "export",
  // Emit each route as a directory with index.html (e.g. /about/index.html)
  // so it serves cleanly from any static file server.
  trailingSlash: true,
  // The static export target has no image optimization server, so serve
  // images as-is.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
