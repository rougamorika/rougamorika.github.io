import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CodeTheme =
  | 'anime-custom'
  | 'github-light'
  | 'atom-one-light'
  | 'dracula'
  | 'monokai';

interface ThemeCategory {
  custom: CodeTheme[];
  light: CodeTheme[];
  dark: CodeTheme[];
}

interface CodeThemeStore {
  currentTheme: CodeTheme;
  themes: ThemeCategory;
  setTheme: (theme: CodeTheme) => void;
}

export const useCodeThemeStore = create<CodeThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'anime-custom',
      themes: {
        custom: ['anime-custom'],
        light: ['github-light', 'atom-one-light'],
        dark: ['dracula', 'monokai'],
      },
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'code-theme-storage',
    }
  )
);
