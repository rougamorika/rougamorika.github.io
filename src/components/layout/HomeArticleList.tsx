import { useEffect, useMemo, useState } from 'react';
import { useArticleStore } from '@store/articleStore';
import type { ArticleMetadata } from '@types/article';
import {
  extractExcerptFromMarkdown,
  HOME_PAGE_SIZE,
  paginateArticles,
  resolveCategoryName,
  sortArticlesByDateDesc,
} from '@utils/articleList';

export function HomeArticleList() {
  const { articleIndex, loadArticle } = useArticleStore();
  const [page, setPage] = useState(1);
  const [excerpts, setExcerpts] = useState<Record<string, string>>({});

  const sortedArticles = useMemo(
    () => sortArticlesByDateDesc(articleIndex?.articles ?? []),
    [articleIndex?.articles],
  );

  const pagination = useMemo(
    () => paginateArticles(sortedArticles, page, HOME_PAGE_SIZE),
    [page, sortedArticles],
  );

  useEffect(() => {
    setPage(1);
  }, [articleIndex]);

  useEffect(() => {
    let cancelled = false;

    async function loadExcerpts(articles: ArticleMetadata[]) {
      const missing = articles.filter((article) => excerpts[article.id] === undefined);
      if (missing.length === 0) return;

      const loadedEntries = await Promise.all(
        missing.map(async (article) => {
          try {
            const response = await fetch(`/${article.path}`);
            if (!response.ok) return [article.id, ''] as const;
            const markdown = await response.text();
            return [article.id, extractExcerptFromMarkdown(markdown)] as const;
          } catch {
            return [article.id, ''] as const;
          }
        }),
      );

      if (!cancelled) {
        setExcerpts((current) => ({
          ...current,
          ...Object.fromEntries(loadedEntries),
        }));
      }
    }

    loadExcerpts(pagination.items);

    return () => {
      cancelled = true;
    };
  }, [pagination.items, excerpts]);

  if (!articleIndex) {
    return (
      <section className="tao-home-list">
        <p className="tao-current-meta">正在加载文章索引...</p>
      </section>
    );
  }

  if (sortedArticles.length === 0) {
    return (
      <section className="tao-home-list">
        <h1>暂无文章</h1>
        <p className="tao-current-meta">文章索引为空。</p>
      </section>
    );
  }

  return (
    <section className="tao-home-list" aria-label="文章列表">
      <header className="tao-home-list-header">
        <h1>What's new</h1>
        <p>Recent entries, notes, and problem-driven fragments.</p>
      </header>

      <div className="tao-entry-list">
        {pagination.items.map((article) => {
          const categoryName = resolveCategoryName(articleIndex, article.category);

          return (
          <article key={article.id} className="tao-entry-summary">
            <div className="post-meta">
              <h2 className="post-title">
                <button type="button" onClick={() => loadArticle(article.id)}>
                  {article.title}
                </button>
              </h2>
              <p className="post-metadata">
                {new Date(article.date).toLocaleDateString('zh-CN')} in {categoryName}
                {article.tags.length > 0 && (
                  <>
                    {' '}| Tags:{' '}
                    {article.tags.map((tag) => (
                      <span key={tag} className="tag-item">
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </p>
            </div>

            {excerpts[article.id] && (
              <p className="tao-entry-excerpt">{excerpts[article.id]}</p>
            )}

            <button
              type="button"
              className="tao-read-more"
              onClick={() => loadArticle(article.id)}
            >
              阅读全文
            </button>
          </article>
          );
        })}
      </div>

      {pagination.totalPages > 1 && (
        <nav className="tao-pagination" aria-label="文章分页">
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
            disabled={!pagination.hasNext}
          >
            <span aria-hidden="true">«</span> Previous Entries
          </button>
          <span>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!pagination.hasPrevious}
          >
            Next Entries <span aria-hidden="true">»</span>
          </button>
        </nav>
      )}
    </section>
  );
}
