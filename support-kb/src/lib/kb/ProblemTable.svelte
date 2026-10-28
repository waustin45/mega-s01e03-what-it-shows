<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { splitTicket, type Problem } from '#lib/kb/split';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // tickets: where each problem is tracked now, problem → issue URL.
  let { ticket, tickets = {}, outcomes = {} }: {
    ticket: number;
    tickets?: Partial<Record<Problem, string>>;
    outcomes?: Partial<Record<Problem, string>>;
  } = $props();

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
  <strong>{split.problems.length}</strong> {split.problems.length === 1 ? 'cause' : 'causes'}
</p>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>cause</th><th>reports</th><th>tagged as</th><th>tenants</th><th>seen</th><th>ticket / disposition</th></tr>
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
          {#if outcomes[p.problem]}<br /><span class="small">{outcomes[p.problem]}</span>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
</div>

{#if split.oneDayReports.length}
  <details open>
    <summary>{split.oneDayReports.length} one-day observations (already included above)</summary>
    <p class="note">Desk-note observations, not a separately verified cause. Neither their root cause nor
      the parser fix's effect on them is confirmed by the engineering update.</p>
    <ul>
      {#each split.oneDayReports as r (r.id)}
        <li><code>{r.id}</code>: {r.body}</li>
      {/each}
    </ul>
  </details>
{/if}

<style>
  .table-wrap { overflow-x: auto; }
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
</style>
