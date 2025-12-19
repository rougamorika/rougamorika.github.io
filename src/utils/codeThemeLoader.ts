import type { CodeTheme } from '@store/codeThemeStore';

const THEME_CSS_MAP: Record<CodeTheme, string> = {
  'anime-custom': '/styles/code-themes/anime-custom.css',
  'github-light': '/styles/code-themes/github.min.css',
  'atom-one-light': '/styles/code-themes/atom-one-light.min.css',
  'dracula': '/styles/code-themes/dracula.min.css',
  'monokai': '/styles/code-themes/monokai.min.css',
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
