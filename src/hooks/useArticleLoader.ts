import { useState, useEffect } from 'react';
import { useArticleStore } from '@store/articleStore';
import { loadArticle } from '@utils/markdownParser';
import type { Article } from '@types/article';

/**
 * Hook to load and manage article data
 */
export function useArticleLoader(slug?: string) {
  const { currentArticle, setCurrentArticle, setLoading, setError } = useArticleStore();
  const [localArticle, setLocalArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the path to the article
        const articlePath = `/content/articles/${slug}.md`;
        const article = await loadArticle(articlePath);

        setLocalArticle(article);
        setCurrentArticle(article);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load article';
        setError(errorMessage);
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, setCurrentArticle, setLoading, setError]);

  return {
    article: localArticle || currentArticle,
    isLoading: useArticleStore.getState().isLoading,
    error: useArticleStore.getState().error,
  };
}

/**
 * Hook to load article by category and slug
 */
export function useArticleByPath(category: string, slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category || !slug) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const articlePath = `/content/articles/${category}/${slug}.md`;
        const loadedArticle = await loadArticle(articlePath);
        setArticle(loadedArticle);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load article';
        setError(errorMessage);
        console.error('Error loading article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [category, slug]);

  return { article, isLoading, error };
}
