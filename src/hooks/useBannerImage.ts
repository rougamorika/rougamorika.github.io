import { useState, useEffect } from 'react';
import { getRandomBanner, getBannerBySlug, getBannerByCategory } from '@utils/bannerSelector';
import { useUIStore } from '@store/uiStore';

interface UseBannerOptions {
  mode?: 'random' | 'slug' | 'category';
  slug?: string;
  category?: string;
  refreshInterval?: number; // in milliseconds, 0 = no refresh
}

/**
 * Hook to manage banner images with various selection modes
 */
export function useBannerImage(options: UseBannerOptions = {}) {
  const {
    mode = 'random',
    slug,
    category,
    refreshInterval = 0,
  } = options;

  const { currentBanner, setCurrentBanner } = useUIStore();
  const [banner, setBanner] = useState<string>('');

  const selectBanner = () => {
    let selectedBanner: string;

    switch (mode) {
      case 'slug':
        selectedBanner = slug ? getBannerBySlug(slug) : getRandomBanner();
        break;
      case 'category':
        selectedBanner = category ? getBannerByCategory(category) : getRandomBanner();
        break;
      case 'random':
      default:
        selectedBanner = getRandomBanner();
        break;
    }

    setBanner(selectedBanner);
    setCurrentBanner(selectedBanner);
  };

  useEffect(() => {
    // Initial banner selection
    selectBanner();

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(selectBanner, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [mode, slug, category, refreshInterval]);

  return {
    banner: banner || currentBanner || getRandomBanner(),
    refresh: selectBanner,
  };
}

/**
 * Simple hook that just returns a random banner (most common use case)
 */
export function useRandomBanner() {
  return useBannerImage({ mode: 'random' });
}
