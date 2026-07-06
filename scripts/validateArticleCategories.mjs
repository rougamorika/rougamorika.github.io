import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const metadataPath = path.join(root, 'public', 'content', 'metadata', 'articles.json');
const articlesRoot = path.join(root, 'public', 'content', 'articles');

const expectedCategoryNames = new Map([
  ['about', '关于'],
  ['blog', '博客'],
  ['roast', '吐槽'],
  ['calculus', '数学'],
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) return {};
  const result = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    result[key] = value;
  }
  return result;
}

function expectedCategoryFromPath(articlePath) {
  const normalized = articlePath.replaceAll('\\\\', '/').replaceAll('\\', '/');
  const match = normalized.match(/(?:^|\/)content\/articles\/([^/]+)\//);
  return match?.[1] ?? null;
}

const metadata = readJson(metadataPath);
const failures = [];

for (const [categoryId, expectedName] of expectedCategoryNames) {
  const category = metadata.categories?.[categoryId];
  if (!category) {
    failures.push(`metadata missing category '${categoryId}'`);
    continue;
  }
  if (category.name !== expectedName) {
    failures.push(`metadata category '${categoryId}' name should be '${expectedName}', got '${category.name}'`);
  }
}

for (const article of metadata.articles ?? []) {
  const categoryFromPath = expectedCategoryFromPath(article.path);
  if (!categoryFromPath) {
    failures.push(`article '${article.id}' has invalid path '${article.path}'`);
    continue;
  }
  if (article.category !== categoryFromPath) {
    failures.push(`metadata article '${article.id}' category should match path category '${categoryFromPath}', got '${article.category}'`);
  }

  const markdownPath = path.join(root, 'public', article.path);
  if (!fs.existsSync(markdownPath)) {
    failures.push(`article '${article.id}' markdown file missing at '${markdownPath}'`);
    continue;
  }
  const frontmatter = parseFrontmatter(fs.readFileSync(markdownPath, 'utf8'));
  if (frontmatter.category !== categoryFromPath) {
    failures.push(`frontmatter article '${article.id}' category should be '${categoryFromPath}', got '${frontmatter.category ?? '(missing)'}'`);
  }
}

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    if (entry.isFile() && /\.mdx?$/i.test(entry.name)) return [fullPath];
    return [];
  });
}

const indexedPaths = new Set((metadata.articles ?? []).map((article) => path.normalize(path.join(root, 'public', article.path))));
for (const markdownPath of walkMarkdownFiles(articlesRoot)) {
  if (!indexedPaths.has(path.normalize(markdownPath))) {
    failures.push(`markdown file is not listed in metadata: '${path.relative(root, markdownPath)}'`);
  }
}

if (failures.length > 0) {
  console.error('Article category validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Article category validation passed.');
