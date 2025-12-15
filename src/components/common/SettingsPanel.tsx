import { useUIStore } from '@store/uiStore';
import { useCodeThemeStore, type CodeTheme } from '@store/codeThemeStore';
import { getThemeDisplayName } from '@utils/codeThemeLoader';

export function SettingsPanel() {
  const { isSettingsPanelOpen, toggleSettingsPanel } = useUIStore();
  const { currentTheme, themes, setTheme } = useCodeThemeStore();

  if (!isSettingsPanelOpen) return null;

  const handleThemeSelect = (theme: CodeTheme) => {
    setTheme(theme);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={toggleSettingsPanel}
      />

      {/* Settings Panel */}
      <div
        className={`
          fixed right-4 top-20 z-50 w-96 max-h-[80vh] overflow-y-auto
          anime-card glass p-6
          transform transition-all duration-300 ease-out
          ${isSettingsPanelOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">设置</h2>
          <button
            onClick={toggleSettingsPanel}
            className="text-2xl text-gray-500 hover:text-anime-pink transition-colors"
            aria-label="关闭设置"
          >
            ✕
          </button>
        </div>

        {/* Code Theme Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-anime-purple">
            代码高亮主题
          </h3>

          {/* Custom Themes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">自定义主题</h4>
            <div className="space-y-2">
              {themes.custom.map((theme) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  isActive={currentTheme === theme}
                  onClick={() => handleThemeSelect(theme)}
                />
              ))}
            </div>
          </div>

          {/* Light Themes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">亮色主题</h4>
            <div className="space-y-2">
              {themes.light.map((theme) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  isActive={currentTheme === theme}
                  onClick={() => handleThemeSelect(theme)}
                />
              ))}
            </div>
          </div>

          {/* Dark Themes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">暗色主题</h4>
            <div className="space-y-2">
              {themes.dark.map((theme) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  isActive={currentTheme === theme}
                  onClick={() => handleThemeSelect(theme)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-anime-pastel-pink">
          <p className="text-xs text-gray-500 text-center">
            主题设置会自动保存
          </p>
        </div>
      </div>
    </>
  );
}

interface ThemeCardProps {
  theme: CodeTheme;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-lg text-left transition-all duration-200
        ${
          isActive
            ? 'border-2 border-anime-pink shadow-anime-glow bg-gradient-to-r from-anime-pastel-pink to-anime-pastel-purple'
            : 'border-2 border-gray-200 hover:border-anime-pastel-purple bg-white'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-800">
            {getThemeDisplayName(theme)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <CodePreview theme={theme} />
          </div>
        </div>
        {isActive && (
          <div className="text-anime-pink text-xl">✓</div>
        )}
      </div>
    </button>
  );
}

interface CodePreviewProps {
  theme: CodeTheme;
}

function CodePreview({ theme }: CodePreviewProps) {
  const previewColors: Record<CodeTheme, { keyword: string; string: string; function: string }> = {
    'anime-custom': { keyword: '#C6A7FF', string: '#FF6B9D', function: '#89CFF0' },
    'github-light': { keyword: '#D73A49', string: '#032F62', function: '#6F42C1' },
    'atom-one-light': { keyword: '#A626A4', string: '#50A14F', function: '#4078F2' },
    'dracula': { keyword: '#FF79C6', string: '#F1FA8C', function: '#8BE9FD' },
    'monokai': { keyword: '#F92672', string: '#E6DB74', function: '#66D9EF' },
  };

  const colors = previewColors[theme];

  return (
    <div className="font-mono text-xs mt-2 p-2 bg-gray-50 rounded border border-gray-200">
      <span style={{ color: colors.keyword }}>const</span>{' '}
      <span style={{ color: colors.function }}>hello</span> ={' '}
      <span style={{ color: colors.string }}>"world"</span>
    </div>
  );
}
