import { useBannerImage } from '@hooks/useBannerImage';
import { DEFAULT_BANNER } from '@utils/bannerSelector';
import { useUIStore } from '@store/uiStore';

const BANNER_ROTATE_INTERVAL = 3 * 60 * 1000; // 3 minutes

export function Header() {
  const { banner, isPinned, togglePin } = useBannerImage({
    refreshInterval: BANNER_ROTATE_INTERVAL,
    defaultBanner: DEFAULT_BANNER,
  });
  const { toggleLeftSidebar, toggleRightSidebar, toggleSettingsPanel } = useUIStore();

  return (
    <header className="tao-site-header">
      {/* Rotating banner image retained as the header visual anchor */}
      <div className="tao-header-image" aria-label="滚动头图">
        <img
          src={`/${banner}`}
          alt=""
          className="tao-header-image-img"
          aria-hidden="true"
        />
        <div className="tao-header-image-scrim" />
      </div>

      <div className="tao-header-title-row">
        <div className="flex gap-2 md:hidden">
          <button
            onClick={toggleLeftSidebar}
            className="tao-header-link-button"
            aria-label="Toggle navigation"
          >
            ☰ 目录
          </button>
        </div>

        <div className="tao-title-block">
          <h1 className="tao-blog-title">肉夹馍旗舰店</h1>
          <p className="tao-tagline">Notes, problems, and mathematical side paths.</p>
        </div>

        <nav className="tao-header-actions" aria-label="站点操作">
          <button
            onClick={togglePin}
            className="tao-header-link-button"
            aria-pressed={isPinned}
            aria-label={isPinned ? '取消固定头图' : '固定当前头图'}
            title={isPinned ? '已固定当前头图，点击恢复轮换' : '固定当前头图，不再自动轮换'}
          >
            {isPinned ? '📌 已固定' : '📌 固定'}
          </button>
          <button
            onClick={toggleSettingsPanel}
            className="tao-header-link-button"
            aria-label="Settings"
          >
            设置
          </button>
          <button
            onClick={toggleRightSidebar}
            className="tao-header-link-button hidden md:inline"
            aria-label="Toggle table of contents"
          >
            本文目录
          </button>
        </nav>
      </div>
    </header>
  );
}

