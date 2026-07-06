import { useMemo, useState } from 'react';
import type { ArticleIndex, ArticleMetadata } from '@types/article';
import { resolveCategoryName, sortArticlesByDateDesc } from '@utils/articleList';

interface SidebarWidgetsProps {
  articleIndex: ArticleIndex | null;
  onSelectArticle: (articleId: string) => void;
}

function groupArchives(articles: ArticleMetadata[]): Array<{ key: string; label: string; count: number; articleIds: string[] }> {
  const groups = new Map<string, { key: string; label: string; count: number; articleIds: string[] }>();

  for (const article of sortArticlesByDateDesc(articles)) {
    const date = new Date(article.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    const group = groups.get(key) ?? { key, label, count: 0, articleIds: [] };
    group.count += 1;
    group.articleIds.push(article.id);
    groups.set(key, group);
  }

  return [...groups.values()];
}

export function SidebarWidgets({ articleIndex, onSelectArticle }: SidebarWidgetsProps) {
  const [query, setQuery] = useState('');
  const [activeArchive, setActiveArchive] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const articles = useMemo(
    () => sortArticlesByDateDesc(articleIndex?.articles ?? []),
    [articleIndex?.articles],
  );

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return articles
      .filter((article) => {
        const categoryName = resolveCategoryName(articleIndex, article.category);
        const haystack = [article.title, article.category, categoryName, ...article.tags].join(' ').toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [articleIndex, articles, query]);

  const archives = useMemo(() => groupArchives(articles), [articles]);
  const categories = articleIndex ? Object.entries(articleIndex.categories) : [];

  return (
    <div className="tao-sidebar-widgets">
      <section className="tao-widget tao-search-widget" aria-label="Search">
        <h3>Search</h3>
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
          />
        </form>
        {query.trim() && (
          <ul className="tao-widget-list tao-search-results">
            {searchResults.length === 0 ? (
              <li className="tao-widget-empty">没有匹配文章。</li>
            ) : (
              searchResults.map((article) => (
                <li key={article.id}>
                  <button type="button" onClick={() => onSelectArticle(article.id)}>
                    {article.title}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </section>

      <section className="tao-widget" aria-label="Archives">
        <h3>Archives</h3>
        {archives.length === 0 ? (
          <p className="tao-widget-empty">暂无归档。</p>
        ) : (
          <ul className="tao-widget-list">
            {archives.map((archive) => (
              <li key={archive.key}>
                <button
                  type="button"
                  onClick={() => setActiveArchive((current) => current === archive.key ? null : archive.key)}
                >
                  {archive.label} ({archive.count})
                </button>
                {activeArchive === archive.key && (
                  <ul className="tao-widget-nested-list">
                    {archive.articleIds.map((articleId) => {
                      const article = articles.find((item) => item.id === articleId);
                      if (!article) return null;
                      return (
                        <li key={article.id}>
                          <button type="button" onClick={() => onSelectArticle(article.id)}>
                            {article.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="tao-widget" aria-label="Categories">
        <h3>Categories</h3>
        {categories.length === 0 ? (
          <p className="tao-widget-empty">暂无分类。</p>
        ) : (
          <ul className="tao-widget-list">
            {categories.map(([categoryId, category]) => (
              <li key={categoryId}>
                <button
                  type="button"
                  onClick={() => setActiveCategory((current) => current === categoryId ? null : categoryId)}
                >
                  {category.name} ({category.articles.length})
                </button>
                {activeCategory === categoryId && (
                  <ul className="tao-widget-nested-list">
                    {category.articles.map((articleId) => {
                      const article = articles.find((item) => item.id === articleId);
                      if (!article) return null;
                      return (
                        <li key={article.id}>
                          <button type="button" onClick={() => onSelectArticle(article.id)}>
                            {article.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}