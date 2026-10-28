# support kb · #4471 split

MEGA.dev S01E03, *what it shows*. Brandon's work on the support desk's kb export (2026-10-04).

Support ticket #4471 merged 412 reports about dates as one known issue. They are three problems:

| problem | reports | ticket |
|---|---|---|
| `parser`: the shared parser reads day-first dates month first | 379 (incl. the 5 one-day moves, as the desk counts them) | [#4](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/4) |
| `hint`: the booking-v3 form hint says MM/DD/YYYY, the form reads DD/MM | 33 | [#2](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/2) |
| `one-day move`: the date shifts by one day (time zone / DST), not a swap | 5 | [#3](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/3) |

## The page

- Source: [`src/routes/kb/incidents/4471/split/+page.svx`](src/routes/kb/incidents/4471/split/+page.svx), signed `Brandon` (desk ref `DR-WCJ1-V3RB`).
- Its logic: [`src/lib/kb/split.ts`](src/lib/kb/split.ts), [`ProblemTable.svelte`](src/lib/kb/ProblemTable.svelte), [`ProblemCount.svelte`](src/lib/kb/ProblemCount.svelte).
- As the desk sees it: [`rendered/kb/incidents/4471/split.html`](rendered/kb/incidents/4471/split.html) (static build of the whole kb in `rendered/`) and a screenshot, [`rendered/kb-incidents-4471-split.png`](rendered/kb-incidents-4471-split.png).

Everything else under `src/` is the kb export as the desk gave it. `package.json`, `svelte.config.js`,
`vite.config.js`, `src/app.html` and `src/routes/+layout.js` were added to build it
(SvelteKit 2, Svelte 5, mdsvex, adapter-static).

```sh
npm install
npm run build      # writes build/
npm run preview    # http://localhost:4173/kb/incidents/4471/split
```
