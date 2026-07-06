import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const articlesRoot = path.join(root, 'Articles');
const publicArticlesRoot = path.join(root, 'public', 'content', 'articles');
const metadataPath = path.join(root, 'public', 'content', 'metadata', 'articles.json');

const categoryDefinitions = [
  {
    id: 'about',
    name: '关于',
    aliases: ['about', '关于'],
    icon: '👤',
    color: '#FF6B9D',
  },
  {
    id: 'blog',
    name: '生活',
    aliases: ['blog', '博客', '生活'],
    icon: '📁',
    color: '#FF6B9D',
  },
  {
    id: 'roast',
    name: '吐槽',
    aliases: ['roast', '吐槽'],
    icon: '666',
    color: '#FF6B9D',
  },
  {
    id: 'calculus',
    name: '数学',
    aliases: ['calculus', 'math', '数学', '微积分'],
    icon: '∫',
    color: '#8FBF60',
  },
];

const categoryByAlias = new Map();
for (const category of categoryDefinitions) {
  for (const alias of category.aliases) {
    categoryByAlias.set(alias.toLowerCase(), category);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function toPosixPath(filePath) {
  return filePath.replaceAll('\\\\', '/').replaceAll('\\', '/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function emptyDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    if (entry.isFile() && /\.mdx?$/i.test(entry.name)) return [fullPath];
    return [];
  });
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map(String).filter(Boolean);
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value) {
  return String(value)
    .trim()
    .replace(/\.mdx?$/i, '')
    .replace(/[\\/]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[<>:"|?*#^[\]{}]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function resolveCategory(data, filePath) {
  const relative = path.relative(articlesRoot, filePath);
  const folderName = relative.split(path.sep)[0];
  const rawCategory = data.category ?? folderName;
  const category = categoryByAlias.get(String(rawCategory).toLowerCase())
    ?? categoryByAlias.get(String(folderName).toLowerCase());

  if (!category) {
    fail(`Unknown category '${rawCategory}' in ${path.relative(root, filePath)}. Add it to categoryDefinitions in scripts/syncObsidianVault.mjs.`);
  }

  return category;
}

function shouldPublish(data) {
  return data.publish !== false && data.draft !== true;
}

if (!fs.existsSync(articlesRoot)) {
  fail('Missing Articles/ directory. Create it or run the initial Obsidian migration first.');
}

const sourceFiles = walkMarkdownFiles(articlesRoot).sort((a, b) => toPosixPath(a).localeCompare(toPosixPath(b), 'zh-CN'));
const publishable = [];
const seenIds = new Set();

for (const sourceFile of sourceFiles) {
  const original = fs.readFileSync(sourceFile, 'utf8');
  const parsed = matter(original);
  const data = parsed.data ?? {};

  if (!shouldPublish(data)) continue;

  const category = resolveCategory(data, sourceFile);
  const id = slugify(data.slug || path.basename(sourceFile, path.extname(sourceFile)));
  if (!id) fail(`Could not resolve slug for ${path.relative(root, sourceFile)}`);
  if (seenIds.has(id)) fail(`Duplicate article slug '${id}' in ${path.relative(root, sourceFile)}`);
  seenIds.add(id);

  const title = String(data.title || path.basename(sourceFile, path.extname(sourceFile))).trim();
  const date = String(data.date || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const tags = normalizeTags(data.tags);
  const outputData = {
    ...data,
    title,
    date,
    category: category.id,
    tags,
  };

  delete outputData.slug;
  delete outputData.publish;
  delete outputData.draft;
  delete outputData.top;
  delete outputData.topOrder;

  const publicRelativePath = `content/articles/${category.id}/${id}.md`;
  const publicFilePath = path.join(root, 'public', publicRelativePath);

  publishable.push({
    id,
    title,
    date,
    tags,
    category,
    publicRelativePath,
    publicFilePath,
    markdown: matter.stringify(parsed.content.trimStart(), outputData),
    sourcePath: toPosixPath(path.relative(root, sourceFile)),
    top: data.top === true,
    topOrder: Number.isFinite(Number(data.topOrder)) ? Number(data.topOrder) : Number.MAX_SAFE_INTEGER,
    banner: data.banner,
    related: data.related,
    difficulty: data.difficulty,
  });
}

emptyDir(publicArticlesRoot);
ensureDir(path.dirname(metadataPath));

const categories = Object.fromEntries(categoryDefinitions.map((category) => [category.id, {
  name: category.name,
  icon: category.icon,
  color: category.color,
  articles: [],
}]));

const articles = publishable
  .sort((a, b) => {
    const categoryDiff = categoryDefinitions.findIndex((category) => category.id === a.category.id)
      - categoryDefinitions.findIndex((category) => category.id === b.category.id);
    if (categoryDiff !== 0) return categoryDiff;
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title, 'zh-CN');
  })
  .map((article) => {
    ensureDir(path.dirname(article.publicFilePath));
    fs.writeFileSync(article.publicFilePath, article.markdown, 'utf8');
    categories[article.category.id].articles.push(article.id);

    const metadata = {
      id: article.id,
      title: article.title,
      path: article.publicRelativePath,
      category: article.category.id,
      tags: article.tags,
      date: article.date,
    };

    if (article.banner) metadata.banner = article.banner;
    if (article.related) metadata.related = article.related;
    if (article.difficulty) metadata.difficulty = article.difficulty;

    return metadata;
  });

const topPosts = publishable
  .filter((article) => article.top)
  .sort((a, b) => a.topOrder - b.topOrder || a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'zh-CN'))
  .map((article) => article.id);

const metadata = {
  articles,
  categories,
  topPosts,
};

fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
console.log(`Synced ${articles.length} published article(s) from Articles/ to public/content/.`);
