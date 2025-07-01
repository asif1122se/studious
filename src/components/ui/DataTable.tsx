import { ReactNode } from "react";
import Empty from "./Empty";
import { HiTable } from "react-icons/hi";

interface Column {
  header: string;
  accessor: string;
  cell?: (row: any, index: number) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyTitle?: string;
  emptyDescription?: string;
  rowOnClick?: (row: any) => void;
  className?: string;
}

export function DataTable({ columns, data, rowOnClick, className, emptyTitle = "No Data", emptyDescription = "There is no data to display." }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Empty 
        icon={HiTable}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-base shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-base">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`transition-colors duration-150 ${
                  rowOnClick ? 'cursor-pointer hover:bg-muted active:bg-muted' : ''
                }`}
                onClick={() => rowOnClick && rowOnClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-foreground"
                  >
                    {column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 