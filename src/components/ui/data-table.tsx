import * as React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderRowActions?: (row: Row<TData>) => React.ReactNode;
  globalFilterPlaceholder?: string;
  serverPagination?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  search?: string;
  onSearch?: (search: string) => void;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    renderRowActions,
    globalFilterPlaceholder,
    serverPagination,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    search,
    onSearch,
  } = {
    globalFilterPlaceholder: "Search...",
    serverPagination: false,
    page: 1,
    pageSize: 10,
    total: 0,
    ...props,
  };

  // For client-side mode
  const [globalFilter, setGlobalFilter] = React.useState("");
  // Sorting state (client-side only for now)
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: serverPagination ? undefined : { globalFilter, sorting },
    onGlobalFilterChange: serverPagination ? undefined : setGlobalFilter,
    onSortingChange: serverPagination ? undefined : setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original as Record<string, unknown>).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  // Pagination and search controls
  const currentPage = serverPagination
    ? page
    : table.getState().pagination.pageIndex + 1;
  const currentPageSize = serverPagination
    ? pageSize
    : table.getState().pagination.pageSize;
  const pageCount = serverPagination
    ? Math.ceil(total / currentPageSize)
    : table.getPageCount();

  // CSV Export
  function exportCSV() {
    if (!data.length) return;
    const headers = columns.map((col) =>
      typeof col.header === "string" ? col.header : ""
    );
    const rows = data.map((row) =>
      columns.map((col) => {
        // Extract accessorKey from ColumnDef
        const key = (col as { accessorKey?: string }).accessorKey as
          | keyof TData
          | undefined;
        return key ? String(row[key] ?? "") : "";
      })
    );
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-2">
        <button
          className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm mb-2 md:mb-0"
          onClick={exportCSV}
        >
          Export CSV
        </button>
        <input
          type="text"
          value={serverPagination ? search : globalFilter}
          onChange={(e) =>
            serverPagination && onSearch
              ? onSearch(e.target.value)
              : setGlobalFilter(e.target.value)
          }
          placeholder={globalFilterPlaceholder}
          className="border px-2 py-1 rounded w-full md:w-64"
        />
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm">
            Page {currentPage} of {pageCount}
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              serverPagination && onPageChange
                ? onPageChange(currentPage - 1)
                : table.previousPage()
            }
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              serverPagination && onPageChange
                ? onPageChange(currentPage + 1)
                : table.nextPage()
            }
            disabled={currentPage >= pageCount}
          >
            Next
          </button>
          <select
            className="border rounded px-1 py-1"
            value={currentPageSize}
            onChange={(e) =>
              serverPagination && onPageSizeChange
                ? onPageSizeChange(Number(e.target.value))
                : table.setPageSize(Number(e.target.value))
            }
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort?.() ?? false;
                const isSorted = header.column.getIsSorted?.();
                return (
                  <TableHead
                    key={header.id}
                    onClick={
                      canSort
                        ? () => {
                            if (serverPagination) return; // Only client-side for now
                            const id = header.column.id;
                            setSorting((prev) => {
                              const existing = prev.find((s) => s.id === id);
                              if (!existing) return [{ id, desc: false }];
                              if (!existing.desc) return [{ id, desc: true }];
                              return [];
                            });
                          }
                        : undefined
                    }
                    className={
                      canSort ? "cursor-pointer select-none" : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {canSort && (
                      <span className="ml-1 inline-block align-middle">
                        {isSorted === "asc" && (
                          <ArrowUp className="w-3 h-3 inline" />
                        )}
                        {isSorted === "desc" && (
                          <ArrowDown className="w-3 h-3 inline" />
                        )}
                      </span>
                    )}
                  </TableHead>
                );
              })}
              {renderRowActions && <TableHead>Actions</TableHead>}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {renderRowActions && (
                  <TableCell>{renderRowActions(row)}</TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (renderRowActions ? 1 : 0)}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
