import styles from "./styles.module.css";

export function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Array<Array<string>>;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((value, cellIndex) => (
                <td key={`${value}-${cellIndex}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
