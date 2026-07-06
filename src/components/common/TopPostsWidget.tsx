import type { ArticleIndex } from '@types/article';
import { resolveTopPosts } from '@utils/articleList';

interface TopPostsWidgetProps {
  articleIndex: ArticleIndex | null;
  onSelectArticle: (articleId: string) => void;
}

export function TopPostsWidget({ articleIndex, onSelectArticle }: TopPostsWidgetProps) {
  const topPosts = articleIndex ? resolveTopPosts(articleIndex) : [];

  return (
    <section className="tao-top-posts-widget" aria-label="Top Posts">
      <h3>Top Posts</h3>
      {topPosts.length === 0 ? (
        <p className="tao-widget-empty">暂无推荐文章。</p>
      ) : (
        <ol>
          {topPosts.map((article) => (
            <li key={article.id}>
              <button type="button" onClick={() => onSelectArticle(article.id)}>
                {article.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
