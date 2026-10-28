# support kb · #4471 split

MEGA.dev S01E03, *what it shows*. Brandon's work on the support desk's kb export (2026-10-04).

The desk merged 412 unique date reports into #4471. Its original classification separates two causes:

| cause | reports | final ticket disposition |
|---|---|---|
| `parser`: shared parser reads day-first dates month first | 379, including the five one-day observations | [#1](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/1), closed COMPLETED |
| `hint`: booking-v3 says MM/DD/YYYY but reads day first | 33 | [#2](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/2), closed NOT_PLANNED |

The five desk-note observations are not five additional reports or a separately verified timezone/DST
cause. [#3](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/3) and
[#4](https://github.com/waustin45/mega-s01e03-what-it-shows/issues/4) are closed DUPLICATE of #1.
The [engineering update](https://hq.mega.dev/challenges/what-it-shows), checked 2026-10-28, records
#4471 closed 2026-10-05: parser FIXED, `fix(dates): parse dd/mm for eu locales`; hint WON'T FIX,
`booking-v3 form retired`. Retirement is not a corrected hint. The update does not confirm whether
the parser fix resolves the one-day observations.

## Pages and supplied files

- [Signed split page](support-kb/src/routes/kb/incidents/4471-split/+page.svx), its
  [standalone HTML](support-kb/src/routes/kb/incidents/4471-split/page.html) and
  [PNG](support-kb/src/routes/kb/incidents/4471-split/page.png). The page carries the course-issued signature and its derived desk reference.
- [Proposed decision 0002](support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx) and
  revised [triage](support-kb/src/routes/kb/triage/dedupe/+page.svx) use evidenced causes and preserve unknown cases
  for review. Austin's approval is pending; accepted decision 0001 is unchanged.
- Added split logic/components: `split.ts`, `ProblemTable.svelte`, `ProblemCount.svelte` in
  `support-kb/src/lib/kb/`. Cause totals and overlapping observations are kept separate.
- Modified supplied pages/components: original incident `incidents/4471/+page.svx`, triage
  `triage/dedupe/+page.svx` and `CauseTable.svelte`. All other supplied source files, including
  `causes.ts`, report data, tenant exports, home/index and decision 0001, remain unchanged.
- Build scaffolding was added around the supplied source: `package.json`, lockfile,
  `svelte.config.js`, `vite.config.js`, `src/app.html` and `src/routes/+layout.js`.
  `scripts/export.mjs` refreshes delivery artifacts from the real SvelteKit build.

## Regenerate the artifacts

Use Node.js 22 or newer. Install the locked dependencies and Playwright's Chromium once:

```sh
cd support-kb
npm ci --ignore-scripts
npx playwright install chromium
npm run export
```

`npm run export` runs `npm run build` into ignored `build/`, replaces committed `rendered/`
with that build, then derives standalone `page.html` (inline CSS, no hydration) and a full-page
`page.png` from it. It does not start a server. Playwright is a development dependency for the
PNG export; all page rendering still comes from SvelteKit/mdsvex. Commit the refreshed artifacts
with source changes. The existing snapshots matched the reviewed source before these corrections.

Open standalone `page.html` directly from disk; its kb navigation points to HTML files in the
committed `rendered/` tree, so keep that tree with it. For the full interactive kb, serve the build:

```sh
npm run preview
# http://localhost:4173/kb
```

These corrections align the kb with the available evidence. They are not a proven fix for the
course's earlier "The desk can't find your page" rejection; its discovery condition was not disclosed.
No new course claim is part of this work.
