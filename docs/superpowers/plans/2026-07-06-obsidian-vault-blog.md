# Obsidian Vault Blog Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `D:\Blog` into an Obsidian-friendly writing repository while keeping Vite/GitHub Pages/Vercel deployment working.

**Architecture:** The repository root becomes an Obsidian vault with `.obsidian/` config and human-facing folders such as `Articles/`, `Drafts/`, `Templates/`, and `Attachments/`. `Articles/` is the tracked writing source; `public/content/articles` and `public/content/metadata/articles.json` become generated output produced by `scripts/syncObsidianVault.mjs` before dev/build.

**Tech Stack:** Node.js ESM scripts, gray-matter frontmatter parsing, Vite public assets, GitHub Pages Actions, Vercel.

---

### Task 1: Add Obsidian vault validation

**Files:**
- Create: `scripts/validateObsidianVault.mjs`

- [ ] **Step 1: Write failing validation**

Create a script that checks `.obsidian/app.json`, `Articles/`, sync scripts, npm scripts, and generated content consistency.

- [ ] **Step 2: Run validation**

Run: `node scripts/validateObsidianVault.mjs`
Expected: FAIL before implementation because vault files do not exist yet.

### Task 2: Create Obsidian vault folders and config

**Files:**
- Create: `.obsidian/app.json`
- Create: `.obsidian/appearance.json`
- Create: `Templates/Blog Post.md`
- Create: `OBSIDIAN.md`
- Modify: `.gitignore`

- [ ] **Step 1: Add root vault configuration**

`D:\Blog` should be directly openable in Obsidian. Hide engineering folders through Obsidian ignore filters.

- [ ] **Step 2: Add writing docs and template**

Document that publishable posts live in `Articles/`, local-only unpublished drafts live in `Drafts/`, and `npm run sync:obsidian` updates the blog output.

### Task 3: Implement vault-to-blog sync

**Files:**
- Create: `scripts/syncObsidianVault.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Write sync script**

Read markdown from `Articles/`, skip draft/private notes, normalize frontmatter, generate `public/content/articles/<category>/<slug>.md`, and generate `public/content/metadata/articles.json`.

- [ ] **Step 2: Add npm scripts**

Add `sync:obsidian`, `predev`, and `prebuild`.

### Task 4: Migrate existing posts into `Articles/`

**Files:**
- Create: `Articles/关于/*.md`
- Create: `Articles/博客/*.md`
- Create: `Articles/吐槽/*.md`
- Modify generated public content through sync output

- [ ] **Step 1: Copy existing published posts into Obsidian source folders**

Use existing metadata categories to choose Chinese folder names.

- [ ] **Step 2: Keep unpublished draft local-only**

Keep `Drafts/数学/calculus-draft-2026-06-29.md` ignored by Git and not published.

### Task 5: Verify build and generated output

**Files:**
- Generated: `public/content/articles/**`
- Generated: `public/content/metadata/articles.json`

- [ ] **Step 1: Run sync and validations**

Run: `npm run sync:obsidian`, `node scripts/validateObsidianVault.mjs`, `node scripts/validateNoDraftsPublished.mjs`, `node scripts/validateArticleCategories.mjs`.

- [ ] **Step 2: Run production build**

Run: `npm run build -- --mode production`
Expected: PASS.
