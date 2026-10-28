<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { splitTicket, type Problem } from '#lib/kb/split';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // Observations are a subset, never added to the cause totals.
  let { ticket, problem, observations = false }: { ticket: number; problem?: Problem; observations?: boolean } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const n = $derived(
    observations ? split.oneDayReports.length :
      problem ? (split.problems.find((p) => p.problem === problem)?.reports.length ?? 0) : split.reports.length,
  );
</script>

<strong>{n}</strong>
