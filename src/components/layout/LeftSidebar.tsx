import { useState, useEffect } from 'react';
import { useUIStore } from '@store/uiStore';
import { useArticleStore } from '@store/articleStore';
import { TopPostsWidget } from '@components/common/TopPostsWidget';
import { SidebarWidgets } from '@components/common/SidebarWidgets';
import type { ArticleIndex } from '@types/article';
import { buildFileTree, type TreeNode } from '@utils/fileTreeBuilder';

export function LeftSidebar() {
  const { isLeftSidebarOpen } = useUIStore();
  const { articleIndex, setArticleIndex, setCurrentArticle, loadArticle } = useArticleStore();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['about']));
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const loadArticleIndex = () => {
    fetch('/content/metadata/articles.json')
      .then((res) => res.json())
      .then((data: ArticleIndex) => {
        setArticleIndex(data);
        const fileTree = buildFileTree(data);
        setTree(fileTree);
      })
      .catch((error) => {
        console.error('Failed to load article index:', error);
      });
  };

  useEffect(() => {
    loadArticleIndex();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleHomeClick = () => {
    setSelectedArticle(null);
    setCurrentArticle(null);
  };

  const handleArticleClick = async (node: TreeNode) => {
    if (node.type !== 'article' || !node.articleId) return;

    setSelectedArticle(node.articleId);
    await loadArticle(node.articleId);
  };

  const handleTopPostClick = async (articleId: string) => {
    setSelectedArticle(articleId);
    await loadArticle(articleId);
  };

  if (!isLeftSidebarOpen) return null;

  return (
    <aside className="sidebar bg-bg-card p-4 w-64">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold mb-4 gradient-text">
          文章目录
        </h3>
      </div>

      <nav className="space-y-2" aria-label="文章导航">
        <div
          className={`nav-item cursor-pointer ${selectedArticle === null ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          Home / 文章流
        </div>

        {tree.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            加载中...
          </div>
        ) : (
          tree.map((category) => (
            <div key={category.id}>
              <div
                className="nav-item cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <span className="text-xs">
                    {expandedCategories.has(category.id) ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedCategories.has(category.id) && category.children && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.children.map((article) => (
                    <div
                      key={article.id}
                      className={`nav-item text-sm cursor-pointer ${
                        selectedArticle === article.articleId ? 'active' : ''
                      }`}
                      onClick={() => handleArticleClick(article)}
                    >
                      <span>{article.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </nav>

      <TopPostsWidget articleIndex={articleIndex} onSelectArticle={handleTopPostClick} />
      <SidebarWidgets articleIndex={articleIndex} onSelectArticle={handleTopPostClick} />

      <div className="mt-8 p-4 anime-card">
        <p className="text-sm text-center text-gray-600">
          选择一个主题开始阅读。
        </p>
      </div>
    </aside>
  );
}


