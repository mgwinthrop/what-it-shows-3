# what-it-shows

Work for MEGA.dev S01E03. Support ticket #4471 merged 412 reports about wrong dates and marked
them known. They hold three problems; each has an issue in this repo (374, 33 and 5 reports; the desk's own table files the 5 under the parser, which makes 379).

- `support-kb/`: the support desk's kb export, plus one new page,
  `src/routes/kb/incidents/4471-split/+page.svx`. The page is signed in its frontmatter.
- `analysis/count.mjs`: counts the reports by problem. Run `node analysis/count.mjs` from the
  repo root. `analysis/groups.json` is its output (report ids per problem).

- `rendered/4471-split.html`: the page as the desk sees it, prerendered from the `.svx` with
  the kb's own layout and components. The desk ref in its footer, `DR-VB80-6J04`, is derived
  from the page's `signature`.
- `render-config/`: the minimal build setup used to render it (the export ships no build files).
  Copy `src/` from `support-kb/`, add `vite.config.js` and `package.json`, then `npm install`
  svelte, @sveltejs/kit, @sveltejs/adapter-static, @sveltejs/vite-plugin-svelte, vite, mdsvex
  and run `vite build`.
