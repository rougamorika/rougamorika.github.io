import type { ArticleIndex, Category } from '@types/article';

export interface TreeNode {
  id: string;
  name: string;
  type: 'category' | 'article';
  icon?: string;
  color?: string;
  children?: TreeNode[];
  articleId?: string;
  path?: string;
}

/**
 * Build a tree structure from article index
 */
export function buildFileTree(articleIndex: ArticleIndex): TreeNode[] {
  const tree: TreeNode[] = [];

  // Create category nodes
  Object.entries(articleIndex.categories).forEach(([categoryId, category]) => {
    const categoryNode: TreeNode = {
      id: categoryId,
      name: category.name,
      type: 'category',
      icon: category.icon,
      color: category.color,
      children: [],
    };

    // Add articles to this category
    category.articles.forEach((articleId) => {
      const article = articleIndex.articles.find((a) => a.id === articleId);
      if (article) {
        categoryNode.children!.push({
          id: article.id,
          name: article.title,
          type: 'article',
          articleId: article.id,
          path: article.path,
        });
      }
    });

    tree.push(categoryNode);
  });

  return tree;
}

/**
 * Find an article node in the tree by ID
 */
export function findArticleInTree(tree: TreeNode[], articleId: string): TreeNode | null {
  for (const node of tree) {
    if (node.type === 'article' && node.articleId === articleId) {
      return node;
    }
    if (node.children) {
      const found = findArticleInTree(node.children, articleId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get all article IDs from the tree
 */
export function getAllArticleIds(tree: TreeNode[]): string[] {
  const ids: string[] = [];

  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'article' && node.articleId) {
        ids.push(node.articleId);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return ids;
}
