## Goal

Make current blog deploy cleanly to Vercel as pure static site.

Scope for this phase:

- Keep `server/` out of production deploy path.
- Remove frontend runtime dependency on local Express server.
- Clean malformed tracked content paths that can poison cross-platform deploys.
- Verify local production build still passes.

Out of scope for this phase:

- Moving `server/` into separate repo.
- Rebuilding backend features on Vercel Functions.
- Refactoring content pipeline beyond deploy-critical cleanup.

## Current State

Project uses Vite static frontend with Vercel config targeting `dist`.

But frontend still calls `http://localhost:3001/api/bgm/sync` during app startup. That endpoint only exists in local Express app under `server/`, which Vercel does not run in current static deployment model.

Repository also contains malformed tracked paths under `public/content/articles/` that appear to be accidental shell command strings written as filenames. These are unnecessary for runtime and risky for Vercel/Linux checkout behavior.

## Approach

Use minimal repair.

1. Remove startup BGM sync call from frontend.
2. Keep static playlist loading from `/BGM/playlist.json`.
3. Delete malformed tracked article paths from repo.
4. Keep `vercel.json` static deploy model unchanged unless validation proves it is part of failure.
5. Rebuild locally to confirm result.

## Expected Outcome

After this phase:

- Vercel deploy path matches app architecture.
- App no longer depends on unreachable `localhost` backend in production.
- Repo no longer contains known malformed deploy-risk paths.
- Static blog remains functional for reading content and loading music from committed assets.

## Verification

- `npm run build` exits successfully.
- Search confirms no production frontend call to `localhost:3001` remains.
- Malformed tracked content paths are removed from git working tree.

## Follow-Up

Later phase C can fully separate or remove `server/` from this repo.
