import type { ReactNode } from 'react';

interface YearArchiveProps<T> {
  entries: readonly T[];
  children: (entry: T) => ReactNode;
}

export default function YearArchive<T extends { year: string | number }>({ entries, children }: YearArchiveProps<T>) {
  const groups = new Map<number, T[]>();
  for (const entry of entries) {
    const year = Number(entry.year);
    const group = groups.get(year);
    if (group) group.push(entry);
    else groups.set(year, [entry]);
  }

  return (
    <div className="year-archive">
      {Array.from(groups).sort(([a], [b]) => b - a).map(([year, group]) => (
        <section key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className="archive-year">{year}</h2>
          {group.map(children)}
        </section>
      ))}
    </div>
  );
}
