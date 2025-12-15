import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

/**
 * Parse markdown content and convert to HTML
 * Simplified version without gray-matter to avoid issues
 */
export async function parseMarkdown(markdownContent: string): Promise<{
  html: string;
  metadata: Record<string, any>;
}> {
  try {
    console.log('parseMarkdown 开始处理，输入长度:', markdownContent.length);

    // Remove frontmatter if present (simple regex approach)
    let content = markdownContent;
    let metadata: Record<string, any> = {};

    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = markdownContent.match(frontmatterRegex);

    if (match) {
      // Extract frontmatter
      const frontmatterText = match[1];
      content = markdownContent.slice(match[0].length);

      // Parse frontmatter (simple key: value parsing)
      frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();
          metadata[key] = value;
        }
      });

      console.log('提取了frontmatter:', Object.keys(metadata));
    }

    console.log('准备处理的markdown内容长度:', content.length);

    // Process markdown to HTML with math support
    const result = await unified()
      .use(remarkParse) // Parse markdown
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkMath) // Parse math notation
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML
      .use(rehypeKatex) // Render math with KaTeX
      .use(rehypeHighlight, { detect: true, subset: false, ignoreMissing: true }) // Syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert to string
      .process(content);

    const html = String(result);
    console.log('parseMarkdown 完成，输出HTML长度:', html.length);

    return {
      html,
      metadata,
    };
  } catch (error) {
    console.error('parseMarkdown 错误:', error);
    throw error;
  }
}

/**
 * Parse markdown file and create Article object
 */
export async function parseArticleFromMarkdown(
  markdownContent: string,
  slug: string
): Promise<any> {
  const { html, metadata } = await parseMarkdown(markdownContent);

  return {
    id: slug,
    slug,
    title: metadata.title || 'Untitled',
    content: html,
    rawMarkdown: markdownContent,
    category: metadata.category || 'uncategorized',
    tags: metadata.tags ? JSON.parse(metadata.tags) : [],
    date: metadata.date || new Date().toISOString(),
    banner: metadata.banner,
    related: metadata.related ? JSON.parse(metadata.related) : [],
    difficulty: metadata.difficulty,
    author: metadata.author,
  };
}

/**
 * Extract metadata from markdown without full parsing
 */
export function extractMetadata(markdownContent: string): any {
  const metadata: Record<string, any> = {};

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = markdownContent.match(frontmatterRegex);

  if (match) {
    const frontmatterText = match[1];
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        metadata[key] = value;
      }
    });
  }

  return {
    id: metadata.slug || metadata.id || '',
    title: metadata.title || 'Untitled',
    path: '',
    category: metadata.category || 'uncategorized',
    tags: metadata.tags ? JSON.parse(metadata.tags) : [],
    date: metadata.date || new Date().toISOString(),
    banner: metadata.banner,
    related: metadata.related ? JSON.parse(metadata.related) : [],
    difficulty: metadata.difficulty,
  };
}

/**
 * Load article from file path
 */
export async function loadArticle(filePath: string): Promise<any> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load article: ${response.statusText}`);
    }

    const markdownContent = await response.text();
    const slug = filePath.split('/').pop()?.replace('.md', '') || '';

    return await parseArticleFromMarkdown(markdownContent, slug);
  } catch (error) {
    console.error('Error loading article:', error);
    throw error;
  }
}

/**
 * Validate article metadata
 */
export function validateArticleMetadata(metadata: any): boolean {
  return (
    typeof metadata.title === 'string' &&
    typeof metadata.category === 'string' &&
    Array.isArray(metadata.tags)
  );
}
