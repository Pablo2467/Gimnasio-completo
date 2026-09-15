import { useState, useMemo, Fragment, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string | number;
  empty?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: (row: T) => string;
  renderExpanded?: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  searchPlaceholder,
  searchValue,
  renderExpanded,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ index: number; dir: "asc" | "desc" } | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | number | null>(null);

  const filtered = useMemo(() => {
    if (!rows) return rows;
    if (!query || !searchValue) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => searchValue(r).toLowerCase().includes(q));
  }, [rows, query, searchValue]);

  const sorted = useMemo(() => {
    if (!filtered || sort === null) return filtered;
    const col = columns[sort.index];
    if (!col.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sort, columns]);

  function toggleSort(index: number) {
    setSort((prev) => {
      if (prev?.index !== index) return { index, dir: "asc" };
      if (prev.dir === "asc") return { index, dir: "desc" };
      return null;
    });
  }

  if (!rows?.length) {
    return (
      <div className="border border-iron-200 bg-white px-6 py-12 text-center text-sm text-iron-400">
        {empty ?? "No hay registros todavía."}
      </div>
    );
  }

  return (
    <div className="border border-iron-200 bg-white">
      {searchValue && (
        <div className="border-b border-iron-200 px-4 py-2.5 flex items-center gap-2">
          <Search size={15} className="text-iron-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder ?? "Buscar…"}
            className="flex-1 text-sm outline-none placeholder:text-iron-400"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-iron-200">
              {renderExpanded && <th className="w-8" />}
              {columns.map((c, i) => (
                <th
                  key={c.header}
                  onClick={c.sortValue ? () => toggleSort(i) : undefined}
                  className={`px-4 py-3 text-xs font-semibold text-iron-400 select-none ${
                    c.align === "right" ? "text-right" : "text-left"
                  } ${c.sortValue ? "cursor-pointer hover:text-iron-700" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortValue && sort?.index === i && (
                      sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted?.map((row) => {
              const key = rowKey(row);
              const isExpanded = expandedKey === key;
              return (
                <Fragment key={key}>
                  <tr
                    onClick={renderExpanded ? () => setExpandedKey(isExpanded ? null : key) : undefined}
                    className={`border-b border-iron-200 last:border-0 hover:bg-iron-50 ${
                      renderExpanded ? "cursor-pointer" : ""
                    }`}
                  >
                    {renderExpanded && (
                      <td className="pl-4 text-iron-400">
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td
                        key={c.header}
                        className={`px-4 py-3 text-sm ${c.align === "right" ? "text-right" : "text-left"}`}
                      >
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                  {renderExpanded && isExpanded && (
                    <tr className="bg-iron-50 border-b border-iron-200">
                      <td colSpan={columns.length + 1} className="px-4 py-4">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted && rows && sorted.length !== rows.length && (
        <p className="border-t border-iron-200 px-4 py-2 text-xs text-iron-400">
          {sorted.length} de {rows.length} resultados
        </p>
      )}
    </div>
  );
}