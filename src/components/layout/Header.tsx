import { useRandomBanner } from '@hooks/useBannerImage';
import { useArticleStore } from '@store/articleStore';
import { useEditorStore } from '@store/editorStore';
import { useUIStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';

export function Header() {
  const { banner } = useRandomBanner();
  const { currentArticle } = useArticleStore();
  const { isEditMode, toggleEditMode } = useEditorStore();
  const { toggleLeftSidebar, toggleRightSidebar, toggleSettingsPanel } = useUIStore();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Scroll to top to show the cover page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="relative h-64 overflow-hidden">
      {/* Pink Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-anime-pink via-anime-purple to-anime-blue" />

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 anime-bg-pattern" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          {/* Mobile Menu Buttons */}
          <div className="flex gap-2 md:hidden">
            <button
              onClick={toggleLeftSidebar}
              className="anime-button text-sm"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>

          {/* Logo/Title */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white glow-text drop-shadow-2xl">
              ✨ Anime Math Blog ✨
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Edit Button - Only show when authenticated */}
            {isAuthenticated && (
              <button
                onClick={toggleEditMode}
                className={`anime-button text-sm ${isEditMode ? 'bg-anime-purple' : ''}`}
                aria-label={isEditMode ? 'View mode' : 'Edit mode'}
              >
                {isEditMode ? '👁️ View' : '✏️ Edit'}
              </button>
            )}
            <button
              onClick={toggleSettingsPanel}
              className="anime-button text-sm"
              aria-label="Settings"
            >
              ⚙️
            </button>
            <button
              onClick={toggleRightSidebar}
              className="anime-button text-sm hidden md:block"
              aria-label="Toggle mind map"
            >
              🗺️
            </button>
            {/* Logout Button - Only show when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="anime-button text-sm bg-gradient-to-r from-anime-pink to-anime-purple"
                aria-label="Logout"
                title="退出登录"
              >
                🚪 退出
              </button>
            )}
          </div>
        </div>

        {/* Article Info */}
        <div className="glass rounded-2xl p-4 backdrop-blur-md">
          {currentArticle ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
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
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Anime Math Blog
              </h2>
              <p className="text-white text-sm opacity-90">
                Explore mathematical concepts with an anime twist ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
