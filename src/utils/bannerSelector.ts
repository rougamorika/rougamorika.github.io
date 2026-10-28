// Banner image paths - using actual images from the banner folder
const BANNER_IMAGES = [
  'banner/moe-avatar/adamosina-1038863-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/aniao-ya-1060658-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/anonymous-1239486481-ling.webp',
  'banner/moe-avatar/anonymous-1322907012-screenshot-zhuang-fangyi.webp',
  'banner/moe-avatar/anonymous-1332296477-zhuang-fangyi-arknights.gif',
  'banner/moe-avatar/anonymous-3819152-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/anonymous-923976-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/caaaaarrot-936825-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/celina-7249918-shu-arknights-order-landscape-rating-safe.webp',
  'banner/moe-avatar/eminya-27-984405-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/enddie1060-tyasakura-1200318-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/haku-muc12b-7249183-shu-arknights-order-landscape-rating-safe.webp',
  'banner/moe-avatar/kyusoukyu-1009872-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/molyb-1154102-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/natsuba002-1046622-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/ne2op-1033504-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/njnywy-981034-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/tuzhate-934030-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/wasabi-god0979221584-971296-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/xiayehongming-3980519-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/yamasede-neiko-1044577-ling-arknights-order-landscape.webp',
  'banner/moe-avatar/zayur-1253341-shu-arknights-order-landscape-rating-safe.webp',
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
 * Default banner shown on first load and before the first rotation tick.
 */
export const DEFAULT_BANNER =
  'banner/moe-avatar/caaaaarrot-936825-ling-arknights-order-landscape.webp';

/**
 * Get a random banner image from the collection
 */
export function getRandomBanner(): string {
  const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
  return BANNER_IMAGES[randomIndex];
}

/**
 * Get a banner that differs from the currently displayed one (if possible).
 */
export function getNextBanner(current?: string | null): string {
  if (BANNER_IMAGES.length <= 1) {
    return BANNER_IMAGES[0] ?? DEFAULT_BANNER;
  }

  let nextIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
  if (current && BANNER_IMAGES[nextIndex] === current) {
    nextIndex = (nextIndex + 1) % BANNER_IMAGES.length;
  }

  return BANNER_IMAGES[nextIndex];
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
