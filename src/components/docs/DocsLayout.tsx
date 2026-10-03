import { DocsFrame } from '@/components/docs/DocsFrame';
import { DocsShellClient } from '@/components/docs/DocsShellClient';
import { ThemeToggle } from '@/components/docs/ThemeToggle';
import SiteFooter from '@/components/SiteFooter/SiteFooter';

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsFrame
      chrome={<DocsShellClient />}
      themeToggle={<ThemeToggle />}
      footer={<SiteFooter />}
    >
      {children}
    </DocsFrame>
  );
}
