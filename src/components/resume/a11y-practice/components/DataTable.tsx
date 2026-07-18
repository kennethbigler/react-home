import { useState, type CSSProperties } from "react";

type SortDirection = "none" | "ascending" | "descending";

type Column = {
  name: string;
  key: string;
  sortable?: boolean;
};

type Row = Record<string, string | number>;

type DataTableProps = {
  caption: string;
  columns: Column[];
  rows: Row[];
};

const symbols: Record<SortDirection, string> = {
  none: "v^",
  ascending: "v",
  descending: "^",
};

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const DataTable = ({ caption, columns, rows }: DataTableProps) => {
  const [sortedCol, setSortedCol] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  const sortedRows =
    sortedCol !== "" && sortDirection !== "none"
      ? [...rows].sort((a, b) => {
          const aVal = a[sortedCol];
          const bVal = b[sortedCol];
          if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "ascending"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          return sortDirection === "ascending"
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
        })
      : rows;

  const handleClick = (colKey: string) => () => {
    if (sortedCol !== colKey) {
      setSortedCol(colKey);
      setSortDirection("ascending");
      return;
    }

    setSortDirection((d) => {
      if (d === "none") {
        return "ascending";
      } else if (d === "ascending") {
        return "descending";
      } else {
        return "none";
      }
    });
  };

  const sortedColumn = columns.find((col) => col.key === sortedCol);

  return (
    <>
      <span style={srOnly} role="status" aria-atomic="true">
        {sortedCol && sortedColumn
          ? `${sortedColumn.name} sorted ${sortDirection}`
          : ""}
      </span>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map(({ name, key, sortable }) => (
              <th
                key={key}
                aria-sort={
                  sortable
                    ? sortedCol === key
                      ? sortDirection
                      : "none"
                    : undefined
                }
                scope="col"
              >
                {sortable ? (
                  <button onClick={handleClick(key)}>
                    {name}{" "}
                    <span aria-hidden={true}>
                      {sortedCol === key
                        ? symbols[sortDirection]
                        : symbols.none}
                    </span>
                  </button>
                ) : (
                  name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={`row-${i}`}>
              {columns.map(({ key }) => (
                <td key={`${key}-${i}`}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const columnsExample: Column[] = [
  { name: "Name", key: "name", sortable: true },
  { name: "Age", key: "age", sortable: false },
  { name: "Role", key: "role", sortable: true },
];

const rowsExample: Row[] = [
  { name: "Alice", age: 32, role: "Engineer" },
  { name: "Bob", age: 28, role: "Designer" },
  { name: "Carol", age: 35, role: "Manager" },
];

const App = () => {
  return (
    <DataTable
      columns={columnsExample}
      rows={rowsExample}
      caption="Steering Committee Members"
    />
  );
};

export default App;
