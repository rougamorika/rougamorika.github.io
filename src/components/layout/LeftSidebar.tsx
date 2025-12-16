import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore } from '@store/uiStore';
import { useArticleStore } from '@store/articleStore';
import { useAuthStore } from '@store/authStore';
import type { ArticleIndex } from '@types/article';
import { buildFileTree, type TreeNode } from '@utils/fileTreeBuilder';

const API_BASE_URL = 'http://localhost:3001';

export function LeftSidebar() {
  const { isLeftSidebarOpen } = useUIStore();
  const { setCurrentArticle, setLoading } = useArticleStore();
  const { isAuthenticated, token } = useAuthStore();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['about']));
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showCreateArticleDialog, setShowCreateArticleDialog] = useState(false);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleSlug, setNewArticleSlug] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'article' | 'category', id: string, category?: string, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Drag and drop states
  const [draggedArticle, setDraggedArticle] = useState<{ slug: string, category: string, name: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

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
      console.log('=== 加载文章 ===');
      console.log('文章路径:', node.path);
      console.log('完整URL:', `/${node.path}`);

      const response = await fetch(`/${node.path}`);
      console.log('响应状态:', response.status, response.statusText);
      console.log('响应类型:', response.headers.get('content-type'));

      if (!response.ok) throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : 'Failed to load article');

      const markdownContent = await response.text();
      console.log('获取的内容长度:', markdownContent.length);
      console.log('内容前200字:', markdownContent.substring(0, 200));

      // Parse the article using the markdown parser
      const { parseArticleFromMarkdown } = await import('@utils/markdownParser');
      const article = await parseArticleFromMarkdown(markdownContent, node.articleId || '');
      console.log('解析后的文章:', article.title, '内容长度:', article.content?.length);

      setCurrentArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
      if (import.meta.env.PROD) {
        alert('丫的你没有权限别乱摸');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!newArticleTitle || !newArticleSlug || !selectedCategory) {
      setCreateError('请填写所有必填字段');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      console.log('Creating article:', { title: newArticleTitle, slug: newArticleSlug, category: selectedCategory });

      const response = await fetch(`${API_BASE_URL}/api/articles/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newArticleTitle,
          slug: newArticleSlug,
          category: selectedCategory
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : '服务器返回了非JSON响应，请检查后端服务器');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : (data.message || '创建文章失败'));
      }

      // Reset form and close dialog
      setNewArticleTitle('');
      setNewArticleSlug('');
      setSelectedCategory('');
      setShowCreateArticleDialog(false);

      // Reload article index
      loadArticleIndex();

      alert('文章创建成功！');
    } catch (error) {
      console.error('Error creating article:', error);
      setCreateError(error instanceof Error ? error.message : (import.meta.env.PROD ? '丫的你没有权限别乱摸' : '创建文章失败'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryId || !newCategoryName) {
      setCreateError('请填写所有必填字段');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      console.log('Creating category:', { id: newCategoryId, name: newCategoryName, icon: newCategoryIcon });

      const response = await fetch(`${API_BASE_URL}/api/articles/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: newCategoryId,
          name: newCategoryName,
          icon: newCategoryIcon,
          color: '#FF6B9D'
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : '服务器返回了非JSON响应，请检查后端服务器');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : (data.message || '创建分类失败'));
      }

      // Reset form and close dialog
      setNewCategoryId('');
      setNewCategoryName('');
      setNewCategoryIcon('📁');
      setShowCreateCategoryDialog(false);

      // Reload article index
      loadArticleIndex();

      alert('分类创建成功！');
    } catch (error) {
      console.error('Error creating category:', error);
      setCreateError(error instanceof Error ? error.message : (import.meta.env.PROD ? '丫的你没有权限别乱摸' : '创建分类失败'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (type: 'article' | 'category', id: string, name: string, category?: string) => {
    setDeleteTarget({ type, id, name, category });
    setShowDeleteDialog(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      let url = '';
      if (deleteTarget.type === 'article') {
        url = `${API_BASE_URL}/api/articles/${deleteTarget.category}/${deleteTarget.id}`;
      } else {
        url = `${API_BASE_URL}/api/articles/category/${deleteTarget.id}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : (data.message || '删除失败'));
      }

      // Close dialog and reload
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      loadArticleIndex();

      alert(`${deleteTarget.type === 'article' ? '文章' : '分类'}删除成功！`);
    } catch (error) {
      console.error('Error deleting:', error);
      setDeleteError(error instanceof Error ? error.message : (import.meta.env.PROD ? '丫的你没有权限别乱摸' : '删除失败'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, article: TreeNode, category: string) => {
    setDraggedArticle({ slug: article.articleId!, category, name: article.name });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(categoryId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedArticle || draggedArticle.category === targetCategory) {
      setDraggedArticle(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${draggedArticle.slug}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromCategory: draggedArticle.category,
          toCategory: targetCategory
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(import.meta.env.PROD ? '丫的你没有权限别乱摸' : (data.message || '移动失败'));
      }

      // Reload article index
      loadArticleIndex();

      alert(`文章"${draggedArticle.name}"已移动到新分类！`);
    } catch (error) {
      console.error('Error moving article:', error);
      alert(error instanceof Error ? error.message : (import.meta.env.PROD ? '丫的你没有权限别乱摸' : '移动文章失败'));
    } finally {
      setDraggedArticle(null);
    }
  };

  if (!isLeftSidebarOpen) return null;

  return (
    <aside className="sidebar bg-bg-card border-r-2 border-anime-pastel-pink p-4 w-64">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold mb-4 gradient-text">
          📚 Content Tree
        </h3>

        {/* Create buttons - only show when authenticated */}
        {isAuthenticated && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowCreateArticleDialog(true)}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-anime-pink to-anime-purple text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
              title="新建文章"
            >
              📝 新建文章
            </button>
            <button
              onClick={() => setShowCreateCategoryDialog(true)}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-anime-purple to-anime-blue text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
              title="新建分类"
            >
              📁 新建分类
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tree */}
      <nav className="space-y-2">
        {tree.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            Loading articles...
          </div>
        ) : (
          tree.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div
                className={`nav-item cursor-pointer group relative ${
                  dropTarget === category.id ? 'bg-anime-pink/20 border-2 border-anime-pink' : ''
                }`}
                onClick={() => toggleCategory(category.id)}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick('category', category.id, category.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        title="删除分类"
                      >
                        🗑️
                      </button>
                    )}
                    <span className="text-xs">
                      {expandedCategories.has(category.id) ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Articles in Category */}
              {expandedCategories.has(category.id) && category.children && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.children.map((article) => (
                    <div
                      key={article.id}
                      draggable={isAuthenticated}
                      onDragStart={(e) => handleDragStart(e, article, category.id)}
                      className={`nav-item text-sm cursor-pointer group relative ${
                        selectedArticle === article.articleId ? 'active' : ''
                      } ${isAuthenticated ? 'cursor-move' : ''}`}
                      onClick={() => handleArticleClick(article)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1">{article.name}</span>
                        {isAuthenticated && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick('article', article.articleId!, article.name, category.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2"
                            title="删除文章"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
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
          ✨ Select a topic to begin your mathematical journey!
        </p>
      </div>

      {/* Create Article Dialog - Rendered via Portal */}
      {showCreateArticleDialog && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
            <h3 className="text-xl font-bold mb-4 gradient-text">📝 新建文章</h3>

            {createError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">文章标题 *</label>
                <input
                  type="text"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                  placeholder="例如：线性代数基础"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">文章 Slug *</label>
                <input
                  type="text"
                  value={newArticleSlug}
                  onChange={(e) => setNewArticleSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                  placeholder="例如：linear-algebra-basics"
                />
                <p className="text-xs text-gray-500 mt-1">用于URL和文件名，只能包含字母、数字和连字符</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">选择分类 *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                >
                  <option value="">请选择分类</option>
                  {tree.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateArticleDialog(false);
                  setCreateError(null);
                  setNewArticleTitle('');
                  setNewArticleSlug('');
                  setSelectedCategory('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={isCreating}
              >
                取消
              </button>
              <button
                onClick={handleCreateArticle}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-anime-pink to-anime-purple text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={isCreating}
              >
                {isCreating ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Dialog - Rendered via Portal */}
      {showDeleteDialog && deleteTarget && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-red-600">⚠️ 确认删除</h3>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {deleteError}
              </div>
            )}

            <p className="mb-6 text-gray-700">
              确定要删除{deleteTarget.type === 'article' ? '文章' : '分类'}
              <span className="font-bold text-anime-pink"> "{deleteTarget.name}" </span>
              吗？
              {deleteTarget.type === 'category' && (
                <span className="block mt-2 text-sm text-gray-500">
                  注意：只能删除空分类。如果分类中有文章，请先删除或移动文章。
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Category Dialog - Rendered via Portal */}
      {showCreateCategoryDialog && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
            <h3 className="text-xl font-bold mb-4 gradient-text">📁 新建分类</h3>

            {createError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">分类名称 *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                  placeholder="例如：拓扑学"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">分类 ID *</label>
                <input
                  type="text"
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                  placeholder="例如：topology"
                />
                <p className="text-xs text-gray-500 mt-1">用于文件夹名，只能包含小写字母和连字符</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">图标</label>
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-pink"
                  placeholder="例如：🔷"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateCategoryDialog(false);
                  setCreateError(null);
                  setNewCategoryId('');
                  setNewCategoryName('');
                  setNewCategoryIcon('📁');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={isCreating}
              >
                取消
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-anime-pink to-anime-purple text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={isCreating}
              >
                {isCreating ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
