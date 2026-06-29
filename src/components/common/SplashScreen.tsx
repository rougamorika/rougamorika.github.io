import { useEffect } from 'react';
import { useRandomBanner } from '@hooks/useBannerImage';

export function SplashScreen() {
  const { banner } = useRandomBanner();

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(/${banner})`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        {/* Animated Title */}
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">
            ✨ 肉夹馍旗舰店 ✨
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-white/80">
            <span className="text-sm mb-2">向下滑动探索</span>
            <svg
              className="w-6 h-6"
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
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">
        ✨
      </div>
      <div className="absolute top-20 right-20 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        🌸
      </div>
      <div className="absolute bottom-20 left-20 text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        ⭐
      </div>
      <div className="absolute bottom-32 right-32 text-6xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        💫
      </div>
    </div>
  );
}
