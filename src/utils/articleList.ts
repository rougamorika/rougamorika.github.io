import type { ArticleIndex, ArticleMetadata } from '@types/article';

export const HOME_PAGE_SIZE = 10;
export const TOP_POSTS_LIMIT = 5;

export function sortArticlesByDateDesc(articles: ArticleMetadata[]): ArticleMetadata[] {
  return [...articles].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title, 'zh-CN');
  });
}

export function paginateArticles(
  articles: ArticleMetadata[],
  page: number,
  pageSize = HOME_PAGE_SIZE,
): {
  items: ArticleMetadata[];
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
} {
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: articles.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    hasPrevious: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export function resolveTopPosts(articleIndex: ArticleIndex, limit = TOP_POSTS_LIMIT): ArticleMetadata[] {
  const byId = new Map(articleIndex.articles.map((article) => [article.id, article]));
  const manualTopPosts = (articleIndex.topPosts ?? [])
    .map((id) => byId.get(id))
    .filter((article): article is ArticleMetadata => Boolean(article));

  if (manualTopPosts.length > 0) {
    return manualTopPosts.slice(0, limit);
  }

  return sortArticlesByDateDesc(articleIndex.articles).slice(0, limit);
}

export function extractExcerptFromMarkdown(markdown: string, maxLength = 180): string {
  const withoutFrontmatter = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  const paragraphs = withoutFrontmatter
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith('#'));

  const firstParagraph = paragraphs[0] ?? '';
  const plainText = firstParagraph
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}…`;
}

export function resolveCategoryName(
  articleIndex: ArticleIndex | null | undefined,
  categoryId: string,
): string {
  return articleIndex?.categories?.[categoryId]?.name ?? categoryId;
}
