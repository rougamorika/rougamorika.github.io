# 用 Obsidian 写这个博客

这个仓库现在可以直接作为 Obsidian vault 打开：

1. 在 Obsidian 里选择 `打开本地仓库/Open folder as vault`。
2. 选择文件夹：`D:\Blog`。
3. 日常写作放在 `Articles/`。
4. 不想发布的草稿放在 `Drafts/`，这个目录已被 Git 忽略。
5. 写完后运行：`npm run sync:obsidian`。
6. 本地预览运行：`npm run dev`。
7. 发布前运行：`npm run build`。

## 文章 frontmatter

每篇要发布的文章建议使用：

```yaml
---
title: 文章标题
date: 2026-07-06
category: 生活
tags: []
publish: true
---
```

支持的分类名：

- `关于` → 关于页/个人页
- `生活` → 生活记录
- `吐槽` → 吐槽文章
- `数学` → 数学文章（内部仍使用 `calculus`，避免旧路径逻辑大改）

如果某篇暂时不想发，写成：

```yaml
publish: false
```

或直接放到 `Drafts/`。

## 同步关系

- Obsidian 源稿：`Articles/**/*.md`
- 博客生成目录：`public/content/articles/**/*.md`
- 博客文章索引：`public/content/metadata/articles.json`

不要手动编辑 `public/content/articles` 里的文章；它们会被同步脚本覆盖。
