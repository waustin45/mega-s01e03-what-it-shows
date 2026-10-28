// Cause totals are disjoint. Desk-note observations overlap those totals; they are not a third cause.
import { groupByCause, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'];

export type ProblemRow = CauseGroup & { problem: Problem };

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; reports: Report[]; problems: ProblemRow[]; oneDayReports: Report[] } {
  const rows = all.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(rows);
  const groups = groupByCause(reports, tenantOf);
  const problems: ProblemRow[] = groups.map((g) => ({ ...g, problem: g.cause }));
  const oneDayReports = reports.filter((r) => oneDayMove.includes(r.id));
  return { rows: rows.length, reports, problems, oneDayReports };
}
