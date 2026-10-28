<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { splitTicket, type Problem } from '#lib/kb/split';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // tickets: where each problem is tracked now, problem → issue URL.
  let { ticket, tickets = {} }: { ticket: number; tickets?: Partial<Record<Problem, string>> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const tags = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
  const issue = (url: string) => '#' + url.split('/').pop();
</script>

<p class="sum">
  <strong>{split.reports.length}</strong> reports merged into #{ticket}
  ({split.rows} rows in the export, {split.rows - split.reports.length} of them repeats) ·
  <strong>{split.problems.length}</strong> {split.problems.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tagged as</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.problems as p (p.problem)}
      <tr>
        <td><code>{p.problem}</code></td>
        <td><strong>{p.reports.length}</strong></td>
        <td class="small">{tags(p.taggedAs)}</td>
        <td class="small">{p.tenants}</td>
        <td class="small">{p.firstSeen} → {p.lastSeen}</td>
        <td>
          {#if tickets[p.problem]}<a href={tickets[p.problem]}>{issue(tickets[p.problem]!)}</a>{:else}<span class="none">none yet</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.problems.filter((p) => p.filedUnder) as p (p.problem)}
  <p class="note">
    The {p.reports.length} <code>{p.problem}</code> reports are counted under <code>{p.filedUnder}</code> too, where
    the desk files them by tenant. They have their own ticket because the <code>{p.filedUnder}</code> fix will not
    fix them.
  </p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
</style>
