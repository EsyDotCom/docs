import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The docs site was migrated into esy.com/docs (June 2026). Forward every
  // inbound docs.esy.com request to the canonical path on esy.com so old links
  // and search results keep resolving. The :path* rule also covers the root.
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://esy.com/docs/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
