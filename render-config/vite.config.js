import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export default async () => ({
  plugins: [
    await sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook: path.join(here, 'src/lib/layouts/runbook.svelte') } })],
      adapter: adapter(),
      alias: { '#lib': 'src/lib' },
      prerender: {
        entries: ['/kb/incidents/4471-split'],
        handleHttpError: 'warn'
      }
    })
  ]
});
