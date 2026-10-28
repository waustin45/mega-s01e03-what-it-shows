// #4471 split into tickets, counted with the desk's own view (CauseTable): one id, one report,
// cause by tenant (causes.ts). The desk's notes (desk-notes.json) hold the reports whose body shows
// a one-day move, not a swap. The desk counts them where they are filed, under their cause; they
// are a problem of their own, so they get a row and a ticket of their own too.
import { groupByCause, readAs, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day move';

export type ProblemRow = {
  problem: Problem;
  reports: Report[];
  taggedAs: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // For the one-day row: the cause the desk files these reports under.
  filedUnder?: CauseGroup['cause'];
};

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; reports: Report[]; problems: ProblemRow[] } {
  const rows = all.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(rows);
  const groups = groupByCause(reports, tenantOf);
  const problems: ProblemRow[] = groups.map((g) => ({ ...g, problem: g.cause }));
  for (const g of groups) {
    if (!readAs(g, oneDayMove)) continue;
    const moved = g.reports.filter((r) => oneDayMove.includes(r.id));
    const days = moved.map((r) => r.receivedAt.slice(0, 10)).sort();
    problems.push({
      problem: 'one-day move',
      reports: moved,
      taggedAs: moved.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
      tenants: new Set(moved.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
      filedUnder: g.cause,
    });
  }
  return { rows: rows.length, reports, problems };
}
