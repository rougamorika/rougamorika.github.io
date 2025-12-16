import express from 'express';
import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from './auth.js';
import { triggerGitCommit } from '../services/gitService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Get the project root directory (two levels up from server/routes)
const PROJECT_ROOT = join(__dirname, '..', '..');
const ARTICLES_DIR = join(PROJECT_ROOT, 'public', 'content', 'articles');
const METADATA_FILE = join(PROJECT_ROOT, 'public', 'content', 'metadata', 'articles.json');

/**
 * POST /api/articles/:slug/save
 * Save article content to markdown file
 * Protected route - requires authentication
 */
router.post('/:slug/save', verifyToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const { content, category } = req.body;

    console.log(`\n📝 Saving article: ${slug}`);
    console.log(`   Category: ${category}`);
    console.log(`   Content length: ${content?.length || 0} characters`);

    // Validate input
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Validate slug (prevent directory traversal)
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    // Construct file path
    const categoryDir = join(ARTICLES_DIR, category);
    const filePath = join(categoryDir, `${slug}.md`);

    console.log(`   File path: ${filePath}`);

    // Ensure category directory exists
    await fs.ensureDir(categoryDir);

    // Write content to file
    await fs.writeFile(filePath, content, 'utf8');

    console.log(`   ✅ File saved successfully`);

    // Update metadata file (optional - for now we'll skip this to keep it simple)
    // In a production system, you'd want to update articles.json here

    // 触发异步 git commit
    triggerGitCommit('update', 'article', slug, { category });

    res.json({
      success: true,
      message: `Article "${slug}" saved successfully`,
      filePath: filePath
    });

  } catch (error) {
    console.error('❌ Error saving article:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save article: ${error.message}`
    });
  }
});

/**
 * POST /api/articles/create
 * Create a new article
 * Protected route - requires authentication
 */
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { title, slug, category } = req.body;

    console.log(`\n📝 Creating new article: ${slug}`);
    console.log(`   Title: ${title}`);
    console.log(`   Category: ${category}`);

    // Validate input
    if (!title || !slug || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, and category are required'
      });
    }

    // Validate slug (prevent directory traversal)
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    // Construct file path
    const categoryDir = join(ARTICLES_DIR, category);
    const filePath = join(categoryDir, `${slug}.md`);

    // Check if file already exists
    const exists = await fs.pathExists(filePath);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Article already exists'
      });
    }

    // Ensure category directory exists
    await fs.ensureDir(categoryDir);

    // Create initial markdown content
    const initialContent = `---
title: ${title}
date: ${new Date().toISOString().split('T')[0]}
category: ${category}
tags: []
---

# ${title}

Start writing your article here...
`;

    // Write content to file
    await fs.writeFile(filePath, initialContent, 'utf8');

    // Update metadata file
    const metadata = await fs.readJson(METADATA_FILE);

    // Add new article to metadata
    const newArticle = {
      id: slug,
      title: title,
      path: `content/articles/${category}/${slug}.md`,
      category: category,
      tags: [],
      date: new Date().toISOString().split('T')[0]
    };

    metadata.articles.push(newArticle);

    // Add article to category
    if (metadata.categories[category]) {
      metadata.categories[category].articles.push(slug);
    }

    await fs.writeJson(METADATA_FILE, metadata, { spaces: 2 });

    console.log(`   ✅ Article created successfully`);

    // 触发异步 git commit
    triggerGitCommit('create', 'article', title, { category, slug });

    res.json({
      success: true,
      message: `Article "${title}" created successfully`,
      article: newArticle
    });

  } catch (error) {
    console.error('❌ Error creating article:', error);
    res.status(500).json({
      success: false,
      message: `Failed to create article: ${error.message}`
    });
  }
});

/**
 * POST /api/articles/category/create
 * Create a new category
 * Protected route - requires authentication
 */
router.post('/category/create', verifyToken, async (req, res) => {
  try {
    const { id, name, icon, color } = req.body;

    console.log(`\n📁 Creating new category: ${name}`);
    console.log(`   ID: ${id}`);

    // Validate input
    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: 'ID and name are required'
      });
    }

    // Validate id (prevent directory traversal)
    if (id.includes('..') || id.includes('/') || id.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    // Create category directory
    const categoryDir = join(ARTICLES_DIR, id);
    await fs.ensureDir(categoryDir);

    // Update metadata file
    const metadata = await fs.readJson(METADATA_FILE);

    // Check if category already exists
    if (metadata.categories[id]) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Add new category to metadata
    metadata.categories[id] = {
      name: name,
      icon: icon || '📁',
      color: color || '#FF6B9D',
      articles: []
    };

    await fs.writeJson(METADATA_FILE, metadata, { spaces: 2 });

    console.log(`   ✅ Category created successfully`);

    // 触发异步 git commit
    triggerGitCommit('create', 'category', name, { id });

    res.json({
      success: true,
      message: `Category "${name}" created successfully`,
      category: metadata.categories[id]
    });

  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(500).json({
      success: false,
      message: `Failed to create category: ${error.message}`
    });
  }
});

/**
 * DELETE /api/articles/category/:id
 * Delete a category
 * Protected route - requires authentication
 * NOTE: This route must come BEFORE /:category/:slug to avoid route conflicts
 */
router.delete('/category/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`\n🗑️ Deleting category: ${id}`);

    // Validate id
    if (id.includes('..') || id.includes('/') || id.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    // Check if category directory exists
    const categoryDir = join(ARTICLES_DIR, id);
    const exists = await fs.pathExists(categoryDir);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has articles
    const files = await fs.readdir(categoryDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    if (mdFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${mdFiles.length} article(s). Please delete or move articles first.`
      });
    }

    // Delete the directory
    await fs.remove(categoryDir);

    // Update metadata file
    const metadata = await fs.readJson(METADATA_FILE);

    // Remove articles from this category
    metadata.articles = metadata.articles.filter(a => a.category !== id);

    // Remove category
    delete metadata.categories[id];

    await fs.writeJson(METADATA_FILE, metadata, { spaces: 2 });

    console.log(`   ✅ Category deleted successfully`);

    // 触发异步 git commit
    triggerGitCommit('delete', 'category', id);

    res.json({
      success: true,
      message: `Category "${id}" deleted successfully`
    });

  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: `Failed to delete category: ${error.message}`
    });
  }
});

/**
 * DELETE /api/articles/:category/:slug
 * Delete an article
 * Protected route - requires authentication
 */
router.delete('/:category/:slug', verifyToken, async (req, res) => {
  try {
    const { category, slug } = req.params;

    console.log(`\n🗑️ Deleting article: ${slug} from category: ${category}`);

    // Validate inputs
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    // Construct file path
    const filePath = join(ARTICLES_DIR, category, `${slug}.md`);

    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Delete the file
    await fs.remove(filePath);

    // Update metadata file
    const metadata = await fs.readJson(METADATA_FILE);

    // Remove article from articles array
    metadata.articles = metadata.articles.filter(a => a.id !== slug);

    // Remove article from category
    if (metadata.categories[category]) {
      metadata.categories[category].articles = metadata.categories[category].articles.filter(id => id !== slug);
    }

    await fs.writeJson(METADATA_FILE, metadata, { spaces: 2 });

    console.log(`   ✅ Article deleted successfully`);

    // 触发异步 git commit
    triggerGitCommit('delete', 'article', slug, { category });

    res.json({
      success: true,
      message: `Article "${slug}" deleted successfully`
    });

  } catch (error) {
    console.error('❌ Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: `Failed to delete article: ${error.message}`
    });
  }
});

/**
 * POST /api/articles/:slug/move
 * Move an article to a different category
 * Protected route - requires authentication
 */
router.post('/:slug/move', verifyToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const { fromCategory, toCategory } = req.body;

    console.log(`\n📦 Moving article: ${slug}`);
    console.log(`   From: ${fromCategory} → To: ${toCategory}`);

    // Validate inputs
    if (!fromCategory || !toCategory) {
      return res.status(400).json({
        success: false,
        message: 'fromCategory and toCategory are required'
      });
    }

    if (fromCategory === toCategory) {
      return res.status(400).json({
        success: false,
        message: 'Article is already in this category'
      });
    }

    // Validate slug and categories
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    // Construct file paths
    const fromPath = join(ARTICLES_DIR, fromCategory, `${slug}.md`);
    const toPath = join(ARTICLES_DIR, toCategory, `${slug}.md`);

    // Check if source file exists
    const exists = await fs.pathExists(fromPath);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Ensure target category directory exists
    await fs.ensureDir(join(ARTICLES_DIR, toCategory));

    // Move the file
    await fs.move(fromPath, toPath, { overwrite: false });

    // Update metadata file
    const metadata = await fs.readJson(METADATA_FILE);

    // Update article's category in metadata
    const article = metadata.articles.find(a => a.id === slug);
    if (article) {
      article.category = toCategory;
      article.path = `content/articles/${toCategory}/${slug}.md`;
    }

    // Remove from old category
    if (metadata.categories[fromCategory]) {
      metadata.categories[fromCategory].articles = metadata.categories[fromCategory].articles.filter(id => id !== slug);
    }

    // Add to new category
    if (metadata.categories[toCategory]) {
      if (!metadata.categories[toCategory].articles.includes(slug)) {
        metadata.categories[toCategory].articles.push(slug);
      }
    }

    await fs.writeJson(METADATA_FILE, metadata, { spaces: 2 });

    console.log(`   ✅ Article moved successfully`);

    // 触发异步 git commit
    triggerGitCommit('move', 'article', slug, { fromCategory, toCategory });

    res.json({
      success: true,
      message: `Article "${slug}" moved from "${fromCategory}" to "${toCategory}"`,
      article: article
    });

  } catch (error) {
    console.error('❌ Error moving article:', error);
    res.status(500).json({
      success: false,
      message: `Failed to move article: ${error.message}`
    });
  }
});

/**
 * GET /api/articles/:category/:slug
 * Load article content from markdown file
 */
router.get('/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;

    // Validate inputs
    if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    const filePath = join(ARTICLES_DIR, category, `${slug}.md`);

    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Read file content
    const content = await fs.readFile(filePath, 'utf8');

    res.json({
      success: true,
      content,
      slug,
      category
    });

  } catch (error) {
    console.error('Error loading article:', error);
    res.status(500).json({
      success: false,
      message: `Failed to load article: ${error.message}`
    });
  }
});

export default router;
