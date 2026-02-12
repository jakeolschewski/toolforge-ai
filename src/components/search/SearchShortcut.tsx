'use client';

import { useEffect } from 'react';

interface SearchShortcutProps {
  onOpen: () => void;
}

export default function SearchShortcut({ onOpen }: SearchShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }

      // Also support / key like GitHub
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        onOpen();
      }
    };

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable')
      );
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpen]);

  return null;
}
