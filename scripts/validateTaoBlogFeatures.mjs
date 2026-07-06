import fs from 'node:fs';

const checks = [];
const exists = (path) => fs.existsSync(path);
const read = (path) => exists(path) ? fs.readFileSync(path, 'utf8') : '';
const add = (name, ok, detail = '') => checks.push({ name, ok, detail });

const app = read('src/App.tsx');
const articleTypes = read('src/types/article.ts');
const markdownParser = read('src/utils/markdownParser.ts');
const store = read('src/store/articleStore.ts');
const leftSidebar = read('src/components/layout/LeftSidebar.tsx');
const rightSidebar = read('src/components/layout/RightSidebar.tsx');
const header = read('src/components/layout/Header.tsx');
const mainContent = read('src/components/layout/MainContent.tsx');
const articleViewer = read('src/components/viewer/ArticleViewer.tsx');
const globals = read('src/styles/globals.css');
const theme = read('src/styles/anime-theme.css');
const tsconfig = read('tsconfig.json');
const viteConfig = read('vite.config.ts');
const metadata = JSON.parse(read('public/content/metadata/articles.json'));
const sidebarWidgets = read('src/components/common/SidebarWidgets.tsx');
const entrySummaryBlock = theme.match(/\.tao-entry-summary\s*\{[\s\S]*?\}/)?.[0] ?? '';
const entryTitleBlock = theme.match(/\.tao-entry-summary \.post-title\s*\{[\s\S]*?\}/)?.[0] ?? '';
const headerImageBlock = theme.match(/\.tao-header-image\s*\{[\s\S]*?\}/)?.[0] ?? '';
const sidebarCssBlocks = [...(globals + '\n' + theme).matchAll(/\.sidebar(?:[^,{]*)?\s*\{[\s\S]*?\}/g)].map((match) => match[0]).join('\n');
const sidebarSource = `${leftSidebar}\n${rightSidebar}`;
const leftSidebarAsideClass = leftSidebar.match(/<aside\s+className="([^"]*)"/)?.[1] ?? '';
const rightSidebarAsideClass = rightSidebar.match(/<aside\s+className="([^"]*)"/)?.[1] ?? '';

add('HomeArticleList component exists', exists('src/components/layout/HomeArticleList.tsx'));
add('TopPostsWidget component exists', exists('src/components/common/TopPostsWidget.tsx'));
add('CommentsSection component exists', exists('src/components/common/CommentsSection.tsx'));
add('Giscus config exists', exists('src/config/giscus.ts'));
add('article list utilities exist', exists('src/utils/articleList.ts'));
add('tsconfig has @config alias', tsconfig.includes('"@config/*"'));
add('vite has @config alias', viteConfig.includes("'@config'"));
add('ArticleIndex supports topPosts', /topPosts\?:\s*string\[\]/.test(articleTypes));
add('metadata has manual topPosts', Array.isArray(metadata.topPosts) && metadata.topPosts.length >= 3);
add('store loadArticle implemented', /loadArticle:\s*async\s*\(slug:\s*string\)\s*=>\s*\{[\s\S]*parseArticleFromMarkdown/.test(store));
add('LeftSidebar stores article index', /setArticleIndex\(data\)/.test(leftSidebar));
add('LeftSidebar no longer auto-loads about article', !/Auto-load the "about" article|handleArticleClick\(aboutArticle\)/.test(leftSidebar));
add('LeftSidebar renders TopPostsWidget', /<TopPostsWidget/.test(leftSidebar));
add('LeftSidebar does not draw article/sidebar separator', !/\bborder-r(?:-\d+)?\b/.test(leftSidebarAsideClass));
add('RightSidebar does not draw article/sidebar separator', !/\bborder-l(?:-\d+)?\b/.test(rightSidebarAsideClass));
add('Header does not render secondary article banner', !/tao-article-banner/.test(header));
add('Header banner uses img element for complete display', /tao-header-image-img/.test(header));
add('Header banner does not crop with background cover', !/background-size:\s*cover/.test(headerImageBlock));
add('App does not render splash banner layer', !/<SplashScreen\s*\/>/.test(app));
add('MainContent renders HomeArticleList when no article', /<HomeArticleList/.test(mainContent));
add('ArticleViewer renders CommentsSection', /<CommentsSection/.test(articleViewer));
add('Markdown parser strips duplicate leading H1', /stripDuplicateLeadingH1/.test(markdownParser) && /content:\s*stripDuplicateLeadingH1\(html,\s*title\)/.test(markdownParser));
add('Tao pagination styles exist', /\.tao-pagination/.test(theme));
add('Tao comments styles exist', /\.tao-comments-section/.test(theme));
add('SidebarWidgets component exists', exists('src/components/common/SidebarWidgets.tsx'));
add('LeftSidebar renders SidebarWidgets', /<SidebarWidgets/.test(leftSidebar));
add('LeftSidebar contains no escaped newline text', !/`n`n/.test(leftSidebar));
add('Search widget exists', /Search/.test(sidebarWidgets));
add('Archives widget exists', /Archives/.test(sidebarWidgets));
add('Categories widget exists', /Categories/.test(sidebarWidgets));
add('Entry summaries avoid horizontal border separator', !/border-bottom/.test(entrySummaryBlock));
add('Post titles avoid horizontal border separator', /border-bottom:\s*0/.test(entryTitleBlock));
add('Sidebar does not use viewport-height independent scroll', !/(h-screen|sticky|overflow-y-auto|h-\[calc\(100vh)/.test(`${sidebarCssBlocks}\n${sidebarSource}`));
add('Sidebar uses natural page flow', /\.sidebar\s*\{[\s\S]*height:\s*auto/.test(globals + '\n' + theme));

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}${check.detail ? `: ${check.detail}` : ''}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} Tao blog feature check(s) failed.`);
  process.exitCode = 1;
}






