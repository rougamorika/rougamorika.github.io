import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const failures = [];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function walkMarkdownFiles(relativeDir) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(root, fullPath).replaceAll('\\', '/');
    if (entry.isDirectory()) return walkMarkdownFiles(relativePath);
    if (entry.isFile() && /\.mdx?$/i.test(entry.name)) return [relativePath];
    return [];
  });
}

if (!exists('.obsidian/app.json')) {
  failures.push('missing .obsidian/app.json; repository root is not configured as an Obsidian vault');
} else {
  const appConfig = readJson('.obsidian/app.json');
  const filters = appConfig.userIgnoreFilters ?? [];
  for (const requiredFilter of ['node_modules/', 'dist/', 'public/', 'src/', 'server/', 'scripts/']) {
    if (!filters.includes(requiredFilter)) {
      failures.push(`.obsidian/app.json should hide engineering folder '${requiredFilter}'`);
    }
  }
}

for (const requiredPath of ['Articles', 'Templates/Blog Post.md', 'OBSIDIAN.md', 'scripts/syncObsidianVault.mjs']) {
  if (!exists(requiredPath)) failures.push(`missing ${requiredPath}`);
}

const packageJson = readJson('package.json');
const scripts = packageJson.scripts ?? {};
for (const requiredScript of ['sync:obsidian', 'predev', 'prebuild']) {
  if (!scripts[requiredScript]) failures.push(`package.json missing script '${requiredScript}'`);
}

if (exists('Articles')) {
  const sourcePosts = walkMarkdownFiles('Articles')
    .filter((relativePath) => {
      const parsed = matter(fs.readFileSync(path.join(root, relativePath), 'utf8'));
      return parsed.data.publish !== false && parsed.data.draft !== true;
    });

  if (sourcePosts.length === 0) failures.push('Articles/ has no publishable markdown posts');

  if (exists('public/content/metadata/articles.json')) {
    const metadata = readJson('public/content/metadata/articles.json');
    const metadataIds = new Set((metadata.articles ?? []).map((article) => article.id));
    for (const sourcePost of sourcePosts) {
      const parsed = matter(fs.readFileSync(path.join(root, sourcePost), 'utf8'));
      const expectedId = parsed.data.slug || path.basename(sourcePost, path.extname(sourcePost));
      if (!metadataIds.has(expectedId)) {
        failures.push(`publishable Obsidian source '${sourcePost}' is missing from generated metadata`);
      }
    }
  }
}

for (const draftPath of walkMarkdownFiles('Drafts')) {
  const draftName = path.basename(draftPath);
  const publicMatch = walkMarkdownFiles('public/content/articles').find((publicPath) => path.basename(publicPath) === draftName);
  if (publicMatch) failures.push(`draft '${draftPath}' should not be generated at '${publicMatch}'`);
}

if (failures.length > 0) {
  console.error('Obsidian vault validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Obsidian vault validation passed.');
