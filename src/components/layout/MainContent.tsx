import { Suspense, lazy } from 'react';
import { useEditorStore } from '@store/editorStore';
import { useArticleStore } from '@store/articleStore';
import { ArticleViewer } from '@components/viewer/ArticleViewer';

// Lazy load Monaco Editor to reduce initial bundle size
const MarkdownEditor = lazy(() =>
  import('@components/editor/MarkdownEditor').then(module => ({
    default: module.MarkdownEditor
  }))
);

export function MainContent() {
  const { isEditMode } = useEditorStore();
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
      {isEditMode ? (
        <div className="h-[calc(100vh-16rem)] anime-content-card">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="anime-spinner"></div>
              <span className="ml-4 text-gray-600">Loading editor...</span>
            </div>
          }>
            <MarkdownEditor />
          </Suspense>
        </div>
      ) : (
        <div className="anime-content-card max-w-4xl mx-auto">
          <ArticleViewer article={currentArticle} />
        </div>
      )}
    </main>
  );
}
