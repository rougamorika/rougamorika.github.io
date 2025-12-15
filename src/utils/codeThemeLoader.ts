import type { CodeTheme } from '@store/codeThemeStore';

const THEME_CSS_MAP: Record<CodeTheme, string> = {
  'anime-custom': '/styles/code-themes/anime-custom.css',
  'github-light': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css',
  'atom-one-light': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css',
  'dracula': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/dracula.min.css',
  'monokai': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/monokai.min.css',
};

/**
 * Dynamically load a code highlighting theme by injecting CSS link
 * @param theme - The theme to load
 */
export function loadCodeTheme(theme: CodeTheme): void {
  // Remove existing theme link if present
  const existingLink = document.getElementById('code-theme-css');
  if (existingLink) {
    existingLink.remove();
  }

  // Create and inject new theme link
  const link = document.createElement('link');
  link.id = 'code-theme-css';
  link.rel = 'stylesheet';
  link.href = THEME_CSS_MAP[theme];
  document.head.appendChild(link);
}

/**
 * Get the display name for a theme
 * @param theme - The theme identifier
 * @returns Human-readable theme name
 */
export function getThemeDisplayName(theme: CodeTheme): string {
  const displayNames: Record<CodeTheme, string> = {
    'anime-custom': 'Anime Custom',
    'github-light': 'GitHub Light',
    'atom-one-light': 'Atom One Light',
    'dracula': 'Dracula',
    'monokai': 'Monokai',
  };
  return displayNames[theme];
}
