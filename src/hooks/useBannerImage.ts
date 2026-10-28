import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_BANNER,
  getBannerByCategory,
  getBannerBySlug,
  getNextBanner,
} from '@utils/bannerSelector';
import { useUIStore } from '@store/uiStore';

const PIN_STORAGE_KEY = 'rougamorika-pinned-banner';

interface UseBannerOptions {
  mode?: 'random' | 'slug' | 'category';
  slug?: string;
  category?: string;
  refreshInterval?: number; // in milliseconds, 0 = no refresh
  defaultBanner?: string;
}

function readPinnedBanner(): string | null {
  try {
    return window.localStorage.getItem(PIN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePinnedBanner(banner: string | null) {
  try {
    if (banner) {
      window.localStorage.setItem(PIN_STORAGE_KEY, banner);
    } else {
      window.localStorage.removeItem(PIN_STORAGE_KEY);
    }
  } catch {
    // localStorage can be unavailable in private mode; pinning just won't persist.
  }
}

/**
 * Manage the header banner: show a default image, rotate it on an interval,
 * and let the visitor pin the current image so it stops rotating.
 */
export function useBannerImage(options: UseBannerOptions = {}) {
  const {
    mode = 'random',
    slug,
    category,
    refreshInterval = 0,
    defaultBanner = DEFAULT_BANNER,
  } = options;

  const { setCurrentBanner } = useUIStore();
  const [banner, setBanner] = useState<string>(() => readPinnedBanner() || defaultBanner);
  const [isPinned, setIsPinned] = useState<boolean>(() => Boolean(readPinnedBanner()));
  const bannerRef = useRef(banner);
  bannerRef.current = banner;

  const applyBanner = useCallback(
    (next: string) => {
      bannerRef.current = next;
      setBanner(next);
      setCurrentBanner(next);
    },
    [setCurrentBanner]
  );

  const selectBanner = useCallback(() => {
    let selectedBanner: string;

    switch (mode) {
      case 'slug':
        selectedBanner = slug ? getBannerBySlug(slug) : getNextBanner(bannerRef.current);
        break;
      case 'category':
        selectedBanner = category ? getBannerByCategory(category) : getNextBanner(bannerRef.current);
        break;
      case 'random':
      default:
        selectedBanner = getNextBanner(bannerRef.current);
        break;
    }

    applyBanner(selectedBanner);
  }, [mode, slug, category, applyBanner]);

  // Publish the initial banner to the shared UI store.
  useEffect(() => {
    setCurrentBanner(bannerRef.current);
  }, [setCurrentBanner]);

  // Rotate the banner unless the visitor pinned the current image.
  useEffect(() => {
    if (!refreshInterval || isPinned) return undefined;

    const interval = window.setInterval(selectBanner, refreshInterval);
    return () => window.clearInterval(interval);
  }, [refreshInterval, isPinned, selectBanner]);

  const togglePin = useCallback(() => {
    setIsPinned((pinned) => {
      if (pinned) {
        writePinnedBanner(null);
        return false;
      }

      writePinnedBanner(bannerRef.current);
      return true;
    });
  }, []);

  return {
    banner,
    isPinned,
    togglePin,
    refresh: selectBanner,
  };
}

/**
 * Simple hook that just returns a random banner (most common use case)
 */
export function useRandomBanner() {
  return useBannerImage({ mode: 'random' });
}
