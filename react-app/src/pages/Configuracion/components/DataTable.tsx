import type { TableProps } from "../types";

type DataTableProps = TableProps & {
  rowKey?: (row: Record<string, any>, index: number) => string | number;
  selectedKey?: string | number | null;
  onRowClick?: (row: Record<string, any>) => void;
};

export default function DataTable(props: DataTableProps) {
  const getKey =
    props.rowKey ??
    ((row: Record<string, any>, index: number) => row.id ?? index);

  return (
    <div className="cfgG-tableWrap">
      <table className="cfgG-table">
        <thead>
          <tr>
            {props.cols.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.rows.length === 0 ? (
            <tr>
              <td className="cfgG-empty" colSpan={props.cols.length}>
                {props.emptyText ?? "Sin registros"}
              </td>
            </tr>
          ) : (
            props.rows.map((r, idx) => {
              const key = getKey(r, idx);
              const selected =
                props.selectedKey != null && key === props.selectedKey;

              return (
                <tr
                  key={String(key)}
                  onClick={() => props.onRowClick?.(r)}
                  className={selected ? "cfgG-rowSelected" : ""}
                  style={{ cursor: props.onRowClick ? "pointer" : undefined }}
                >
                  {props.cols.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(r[c.key], r) : (r[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
