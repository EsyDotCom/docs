'use client';

import { useCallback, useEffect, useState } from 'react';

import { SearchModal } from '@/components/docs/SearchModal';
import { Sidebar } from '@/components/docs/Sidebar';

export function DocsShellClient() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    function handleHotkey(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      } else if (e.key === '/' && !isCmd) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        const isEditable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    }
    window.addEventListener('keydown', handleHotkey);
    return () => window.removeEventListener('keydown', handleHotkey);
  }, []);

  return (
    <>
      <Sidebar onOpenSearch={openSearch} />
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

export default DocsShellClient;
