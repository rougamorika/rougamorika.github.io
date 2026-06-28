import { useState, useEffect } from 'react';
import { useUIStore } from '@store/uiStore';
import { useArticleStore } from '@store/articleStore';
import type { ArticleIndex } from '@types/article';
import { buildFileTree, type TreeNode } from '@utils/fileTreeBuilder';

export function LeftSidebar() {
  const { isLeftSidebarOpen } = useUIStore();
  const { setCurrentArticle, setLoading } = useArticleStore();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['about']));
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const loadArticleIndex = () => {
    fetch('/content/metadata/articles.json')
      .then((res) => res.json())
      .then((data: ArticleIndex) => {
        const fileTree = buildFileTree(data);
        setTree(fileTree);

        // Auto-load the "about" article on initial page load
        const aboutCategory = fileTree.find(cat => cat.id === 'about');
        if (aboutCategory?.children && aboutCategory.children.length > 0) {
          const aboutArticle = aboutCategory.children[0];
          handleArticleClick(aboutArticle);
        } else if (fileTree.length > 0 && fileTree[0].children && fileTree[0].children.length > 0) {
          // Fallback to first article if about doesn't exist
          const firstArticle = fileTree[0].children[0];
          handleArticleClick(firstArticle);
        }
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

  const handleArticleClick = async (node: TreeNode) => {
    if (node.type !== 'article' || !node.path) return;

    setSelectedArticle(node.articleId || null);
    setLoading(true);

    try {
      const response = await fetch(`/${node.path}`);

      if (!response.ok) throw new Error('Failed to load article');

      const markdownContent = await response.text();

      // Parse the article using the markdown parser
      const { parseArticleFromMarkdown } = await import('@utils/markdownParser');
      const article = await parseArticleFromMarkdown(markdownContent, node.articleId || '');

      setCurrentArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLeftSidebarOpen) return null;

  return (
    <aside className="sidebar bg-bg-card border-r-2 border-anime-pastel-pink p-4 w-64">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold mb-4 gradient-text">
          📚 文章目录
        </h3>
      </div>

      {/* Navigation Tree */}
      <nav className="space-y-2">
        {tree.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            加载中...
          </div>
        ) : (
          tree.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
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

              {/* Articles in Category */}
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

      {/* Decorative element */}
      <div className="mt-8 p-4 anime-card">
        <p className="text-sm text-center text-gray-600">
          ✨ 选择一个主题开始你的阅读之旅!
        </p>
      </div>
    </aside>
  );
}
