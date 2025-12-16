import { useArticleStore } from '@store/articleStore';
import type { Article } from '@types/article';
import 'katex/dist/katex.min.css';

interface ArticleViewerProps {
  article?: Article;
}

/**
 * Component to display rendered article content
 */
export function ArticleViewer({ article: propArticle }: ArticleViewerProps) {
  const { currentArticle, isLoading } = useArticleStore();
  const article = propArticle || currentArticle;

  console.log('ArticleViewer 渲染:', {
    hasArticle: !!article,
    articleTitle: article?.title,
    contentLength: article?.content?.length,
    contentPreview: article?.content?.substring(0, 100)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="anime-spinner"></div>
        <span className="ml-4 text-gray-600">加载中...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          欢迎来到 肉夹馍旗舰店! ✨
        </h2>
        <p className="text-gray-600 mb-6">
          点击左侧边栏的文章开始阅读
        </p>
      </div>
    );
  }

  return (
    <article className="prose prose-lg max-w-none">
      {/* Debug info */}
      <div className="not-prose mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
        <div><strong>调试信息:</strong></div>
        <div>标题: {article.title}</div>
        <div>分类: {article.category}</div>
        <div>内容长度: {article.content?.length || 0}</div>
        <div>内容前100字: {article.content?.substring(0, 100)}</div>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span>📅 {new Date(article.date).toLocaleDateString('zh-CN')}</span>
          <span>📂 {article.category}</span>
          {article.difficulty && (
            <span className="tag-item text-xs">
              {article.difficulty}
            </span>
          )}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span key={tag} className="tag-item text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="anime-divider"></div>
      </div>

      {/* Article Content */}
      {article.content ? (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">文章内容为空</p>
        </div>
      )}

      {/* Related Articles */}
      {article.related && article.related.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-anime-pastel-pink">
          <h3 className="text-2xl font-bold mb-4">相关文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.related.map((relatedSlug) => (
              <div key={relatedSlug} className="anime-card p-4 anime-hover cursor-pointer">
                <span className="text-anime-purple">→ {relatedSlug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
