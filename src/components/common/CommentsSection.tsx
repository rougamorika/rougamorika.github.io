import { useEffect, useRef } from 'react';
import type { Article } from '@types/article';
import { giscusConfig, isGiscusConfigured } from '@config/giscus';

interface CommentsSectionProps {
  article: Article;
}

export function CommentsSection({ article }: CommentsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const configured = isGiscusConfigured();

  useEffect(() => {
    if (!configured || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', giscusConfig.category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', giscusConfig.mapping);
    script.setAttribute('data-term', article.slug || article.id);
    script.setAttribute('data-strict', giscusConfig.strict);
    script.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled);
    script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
    script.setAttribute('data-input-position', giscusConfig.inputPosition);
    script.setAttribute('data-theme', giscusConfig.theme);
    script.setAttribute('data-lang', giscusConfig.lang);

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [article.id, article.slug, configured]);

  return (
    <section className="tao-comments-section" aria-label="评论区">
      <h3>Comments</h3>
      {configured ? (
        <div ref={containerRef} />
      ) : (
        <div className="tao-comment-placeholder">
          <p>评论区已预留。启用 GitHub Discussions 后，在 Giscus 配置中填入 category 与 categoryId 即可开启。</p>
          <p className="tao-current-meta">当前不会加载第三方评论脚本，因此不影响静态部署。</p>
        </div>
      )}
    </section>
  );
}
