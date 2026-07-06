import { useBannerImage } from '@hooks/useBannerImage';
import { useUIStore } from '@store/uiStore';

export function Header() {
  const { banner } = useBannerImage({ refreshInterval: 9000 });
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

