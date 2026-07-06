import { create } from 'zustand';
import type { Article, ArticleIndex } from '@types/article';
import { parseArticleFromMarkdown } from '@utils/markdownParser';

interface ArticleStore {
  currentArticle: Article | null;
  articleIndex: ArticleIndex | null;
  isLoading: boolean;
  error: string | null;

  setCurrentArticle: (article: Article | null) => void;
  setArticleIndex: (index: ArticleIndex) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadArticle: (slug: string) => Promise<void>;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  currentArticle: null,
  articleIndex: null,
  isLoading: false,
  error: null,

  setCurrentArticle: (article) => set({ currentArticle: article }),
  setArticleIndex: (index) => set({ articleIndex: index }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadArticle: async (slug: string) => {
    const { articleIndex } = get();
    const metadata = articleIndex?.articles.find((article) => article.id === slug);

    if (!metadata) {
      set({
        error: `Article not found: ${slug}`,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/${metadata.path}`);
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.status}`);
      }

      const markdownContent = await response.text();
      const article = await parseArticleFromMarkdown(markdownContent, metadata.id);

      set({
        currentArticle: {
          ...article,
          title: article.title || metadata.title,
          category: article.category || metadata.category,
          tags: article.tags?.length ? article.tags : metadata.tags,
          date: article.date || metadata.date,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load article',
        isLoading: false,
      });
    }
  },
}));
