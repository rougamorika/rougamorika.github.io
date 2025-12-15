import { useEffect, useState } from 'react';
import { useUIStore } from '@store/uiStore';
import { useArticleStore } from '@store/articleStore';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function RightSidebar() {
  const { isRightSidebarOpen } = useUIStore();
  const { currentArticle } = useArticleStore();
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!currentArticle?.content) {
      setToc([]);
      return;
    }

    // Extract headings from article content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentArticle.content;

    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';
      const id = heading.id || `heading-${index}`;

      // Add id to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      tocItems.push({ id, text, level });
    });

    setToc(tocItems);
  }, [currentArticle]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentId = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100 && rect.top >= -100) {
          currentId = heading.id;
        }
      });

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTocClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isRightSidebarOpen) return null;

  return (
    <aside className="sidebar bg-bg-card border-l-2 border-anime-pastel-purple p-4 w-80">
      <div className="mb-4">
        <h3 className="text-xl font-heading font-bold mb-2 gradient-text">
          📑 文章目录
        </h3>
        <p className="text-xs text-gray-600">点击跳转到对应章节</p>
      </div>

      {/* Table of Contents */}
      <div className="h-[calc(100vh-12rem)] overflow-y-auto">
        {toc.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            暂无目录
          </div>
        ) : (
          <nav className="space-y-1">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTocClick(item.id)}
                className={`
                  block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                  ${activeId === item.id
                    ? 'bg-anime-pink/20 text-anime-pink font-semibold border-l-2 border-anime-pink'
                    : 'text-gray-700 hover:bg-anime-pink/10'
                  }
                `}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Quick Info */}
      <div className="mt-4 p-3 anime-card bg-anime-pastel-pink">
        <p className="text-xs text-gray-700">
          💡 <strong>提示：</strong> 目录会自动高亮当前阅读位置
        </p>
      </div>
    </aside>
  );
}
