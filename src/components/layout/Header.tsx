import { useRandomBanner } from '@hooks/useBannerImage';
import { useArticleStore } from '@store/articleStore';
import { useUIStore } from '@store/uiStore';

export function Header() {
  const { banner } = useRandomBanner();
  const { currentArticle } = useArticleStore();
  const { toggleLeftSidebar, toggleRightSidebar, toggleSettingsPanel } = useUIStore();

  return (
    <header className="relative h-64 overflow-hidden">
      {/* Solid Pink Background */}
      <div className="absolute inset-0 bg-anime-pink" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          {/* Mobile Menu Buttons */}
          <div className="flex gap-2 md:hidden">
            <button
              onClick={toggleLeftSidebar}
              className="px-3 py-2 bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>

          {/* Logo/Title */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              ✨ 肉夹馍旗舰店 ✨
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleSettingsPanel}
              className="px-3 py-2 bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
              aria-label="Settings"
            >
              ⚙️
            </button>
            <button
              onClick={toggleRightSidebar}
              className="px-3 py-2 bg-white/20 text-white text-sm hover:bg-white/30 transition-colors hidden md:block"
              aria-label="Toggle table of contents"
            >
              📑
            </button>
          </div>
        </div>

        {/* Article Info */}
        <div className="bg-white p-4">
          {currentArticle ? (
            <div>
              <h2 className="text-2xl font-bold text-anime-pink mb-2">
                {currentArticle.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-item text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-anime-pink mb-2">
                Welcome to 肉夹馍旗舰店
              </h2>
              <p className="text-gray-600 text-sm">
                Explore mathematical concepts with an anime twist ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
