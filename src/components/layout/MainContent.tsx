import { useArticleStore } from '@store/articleStore';
import { ArticleViewer } from '@components/viewer/ArticleViewer';

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
        <ArticleViewer article={currentArticle} />
      </div>
    </main>
  );
}
