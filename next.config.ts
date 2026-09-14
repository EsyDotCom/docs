import type { NextConfig } from 'next';

/**
 * Pages merged in the September 2026 rewrite. These URLs carry inbound links
 * and search traffic, so each points at the page that absorbed it.
 */
const MERGED: Array<[from: string, to: string]> = [
  ['/concepts/workflow-schemas', '/concepts/workflows'],
  ['/concepts/workflow-templates', '/concepts/workflows'],
  ['/concepts/template-naming', '/concepts/workflows'],
  ['/concepts/runtime-steps', '/concepts/runs'],
  ['/concepts/workflow-specifications', '/concepts/versioning'],
  ['/concepts/workflow-versioning', '/concepts/versioning'],
  ['/concepts/budgets', '/concepts/costs'],
  ['/contracts/gates-and-checks', '/concepts/gates-and-review'],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The docs used to live at esy.com/docs. esy.com forwards /docs/* here with
      // the path intact; a /docs prefix arriving on this host collapses to the root.
      { source: '/docs', destination: '/', permanent: true },
      { source: '/docs/:path*', destination: '/:path*', permanent: true },
      ...MERGED.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default nextConfig;
