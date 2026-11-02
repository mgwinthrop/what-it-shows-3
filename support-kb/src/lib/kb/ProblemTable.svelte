<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  // One id, one report. The desk's cause table groups these by tenant and channel; the reports in
  // desk-notes.json read as a one-day move, not a month flip, so they are counted apart here.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const oneDay = $derived(new Set<string>(notes.oneDayMove));

  const problems = $derived.by(() => {
    const parser = groups.find((g) => g.cause === 'parser')?.reports ?? [];
    const hint = groups.find((g) => g.cause === 'hint')?.reports ?? [];
    return [
      { label: 'The shared parser reads every date month first, so day-first tenants get flipped dates', rs: parser.filter((r) => !oneDay.has(r.id)) },
      { label: 'Booking form v3 prints `MM/DD/YYYY` under the date field, so people in day-first tenants type month first', rs: hint },
      { label: 'An invite lands one day off, with no month flip: a time zone or day boundary problem', rs: parser.filter((r) => oneDay.has(r.id)) }
    ].map((p) => {
      const days = p.rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return { ...p, tenants: new Set(p.rs.map((r) => r.tenant)).size, first: days[0], last: days[days.length - 1] };
    });
  });
  const total = $derived(problems.reduce((n, p) => n + p.rs.length, 0));
</script>

<table>
  <thead>
    <tr><th>#</th><th>problem</th><th>reports</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each problems as p, i}
      <tr><td>{i + 1}</td><td>{p.label}</td><td>{p.rs.length}</td><td>{p.tenants}</td><td>{p.first} → {p.last}</td></tr>
    {/each}
  </tbody>
</table>

<p>{problems.map((p) => p.rs.length).join(' + ')} = {total}. Every report is counted once.</p>
