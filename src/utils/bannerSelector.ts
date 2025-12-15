// Banner image paths - using actual images from the banner folder
const BANNER_IMAGES = [
  'banner/wallhaven-3z7e9v.png',
  'banner/wallhaven-4o3k57_3840x1080.png',
  'banner/wallhaven-4vgelm_1920x1200.png',
  'banner/wallhaven-6llj5w_2560x1440.png',
  'banner/wallhaven-76pjxo_1920x1080.png',
  'banner/wallhaven-83lz7k_2560x1440.png',
  'banner/wallhaven-9oo728_2560x1440.png',
  'banner/wallhaven-9oox21_2842x1600.png',
  'banner/wallhaven-dpqkd3.jpg',
  'banner/wallhaven-mplgw1_2560x1440.png',
  'banner/wallhaven-poomw3_2560x1440.png',
  'banner/wallhaven-r7rjdw_1920x1200.png',
  'banner/wallhaven-w81277_1920x1440.png',
  'banner/wallhaven-w8l7r7_2560x1440.png',
  'banner/wallhaven-yjge6l_2560x1440.png',
  'banner/wallhaven-yqqrgl_2560x1440.png',
];

/**
 * Get a random banner image from the collection
 */
export function getRandomBanner(): string {
  const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
  return BANNER_IMAGES[randomIndex];
}

/**
 * Get a banner by index (useful for consistent banners per article)
 */
export function getBannerByIndex(index: number): string {
  const safeIndex = index % BANNER_IMAGES.length;
  return BANNER_IMAGES[safeIndex];
}

/**
 * Get a banner by article slug (deterministic but pseudo-random)
 */
export function getBannerBySlug(slug: string): string {
  // Simple hash function to convert slug to index
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % BANNER_IMAGES.length;
  return BANNER_IMAGES[index];
}

/**
 * Get all available banner images
 */
export function getAllBanners(): string[] {
  return [...BANNER_IMAGES];
}

/**
 * Get banner by category (maps categories to specific banner styles)
 */
export function getBannerByCategory(category: string): string {
  const categoryMap: Record<string, number> = {
    'algebra': 0,
    'calculus': 3,
    'geometry': 6,
    'statistics': 9,
    'topology': 12,
  };

  const index = categoryMap[category.toLowerCase()] ?? 0;
  return getBannerByIndex(index);
}
