import { useEffect } from 'react';
import { useBannerImage } from '@hooks/useBannerImage';

export function SplashScreen() {
  const { banner } = useBannerImage({ refreshInterval: 9000 });

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="tao-splash-screen">
      <div
        className="tao-splash-background"
        style={{
          backgroundImage: `url(/${banner})`,
        }}
      />
      <div className="tao-splash-overlay" />

      <div className="tao-splash-content">
        <div className="tao-splash-card animate-fade-in-up">
          <p className="tao-splash-kicker">What's new</p>
          <h1 className="tao-splash-title">肉夹馍旗舰店</h1>
        </div>
      </div>

      <div className="tao-scroll-indicator animate-bounce">
        <span>向下滑动探索</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
