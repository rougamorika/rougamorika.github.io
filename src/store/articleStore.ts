import { create } from 'zustand';
import type { Article, ArticleIndex } from '@types/article';

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

export const useArticleStore = create<ArticleStore>((set) => ({
  currentArticle: null,
  articleIndex: null,
  isLoading: false,
  error: null,

  setCurrentArticle: (article) => set({ currentArticle: article }),
  setArticleIndex: (index) => set({ articleIndex: index }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadArticle: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement article loading logic
      // For now, just set loading to false
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load article',
        isLoading: false
      });
    }
  },
}));
