import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const metadataPath = path.join(root, 'public', 'content', 'metadata', 'articles.json');
const publicArticlesRoot = path.join(root, 'public', 'content', 'articles');

const blockedDrafts = [
  {
    id: 'calculus-draft-2026-06-29',
    title: '从积分比较出发到积分不等关系(Easy Ver.)',
    filename: 'calculus-draft-2026-06-29.md',
  },
];

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    if (entry.isFile()) return [fullPath];
    return [];
  });
}

const failures = [];
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const publicFiles = walkFiles(publicArticlesRoot);

for (const draft of blockedDrafts) {
  const metadataArticle = metadata.articles?.find((article) => article.id === draft.id || article.title === draft.title);
  if (metadataArticle) {
    failures.push(`draft '${draft.id}' is still listed in public metadata at ${metadataArticle.path}`);
  }

  const containingCategory = Object.entries(metadata.categories ?? {})
    .find(([, category]) => category.articles?.includes(draft.id));
  if (containingCategory) {
    failures.push(`draft '${draft.id}' is still listed under public category '${containingCategory[0]}'`);
  }

  const publicFile = publicFiles.find((file) => path.basename(file) === draft.filename);
  if (publicFile) {
    failures.push(`draft file is still in public articles: ${path.relative(root, publicFile)}`);
  }
}

if (failures.length > 0) {
  console.error('Draft publication validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('No blocked drafts are published.');
