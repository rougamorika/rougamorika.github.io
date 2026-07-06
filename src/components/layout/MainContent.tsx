import { useArticleStore } from '@store/articleStore';
import { ArticleViewer } from '@components/viewer/ArticleViewer';
import { HomeArticleList } from '@components/layout/HomeArticleList';

export function MainContent() {
  const { currentArticle, isLoading } = useArticleStore();

  if (isLoading) {
    return (
      <main className="main-content flex items-center justify-center">
        <div className="anime-spinner"></div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="anime-content-card max-w-4xl mx-auto">
        {currentArticle ? (
          <ArticleViewer article={currentArticle} />
        ) : (
          <HomeArticleList />
        )}
      </div>
    </main>
  );
}
