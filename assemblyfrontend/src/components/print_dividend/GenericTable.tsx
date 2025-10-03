import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { Shareholder } from "./Searchprint";

export interface Column {
  header: string;
  accessor: string;
  align?: "left" | "center" | "right";
  width?: string;
  renderCell?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

interface GenericTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];
  onRowClick?: (row: any) => void;
  rowClassName?: (row: any) => string;
  emptyMessage?: string;
  showPagination?: boolean;
  sortable?: boolean;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  exportToExcel?: boolean;
}
export const getRemark = (s: Shareholder) => {
  if (s.votingsubscription === 0 && s.totalcapital === 0) {
    return "Only Dividend";
  }
  if (s.votingsubscription > 0 && s.totalcapital > 0) {
    return "";
  }
  return "To Legal";
};
const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,
  title,
  defaultItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 20, 50],
  onRowClick,
  rowClassName,
  emptyMessage = "No data available",
  showPagination = true,
  sortable = false,
  onSort,
  exportToExcel = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (!sortable) return;
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    if (onSort) onSort(field, newDirection);
  };

  const exportData = () => {
    if (data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data to export.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Exporting Data",
      description: "Preparing your file for download...",
    });

    const headers = columns.map((col) => col.header).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.accessor];
          // Ensure values with commas are properly quoted for CSV
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    );

    // Add a Byte Order Mark (BOM) to handle UTF-8 characters like Amharic names
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${title || "table_data"}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "The file has been downloaded successfully.",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      {(title || showPagination || exportToExcel) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 border-b border-gray-200 gap-3">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}

          <div className="flex items-center space-x-2 sm:space-x-4">
            {exportToExcel && (
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 6h-3V1H7v5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-7-3h2v3h-2Zm-4 0h2v3H9ZM4 8h16v12H4Z" />
                  <path d="M12 11h-2v2h2v-2Zm0 4h-2v2h2v-2Zm4-4h-2v2h2v-2Zm0 4h-2v2h2v-2Zm-8 0h-2v2h2v-2Zm4 0h-2v2h2v-2Zm0-4h-2v2h2v-2Z" />
                </svg>
                Export
              </button>
            )}
            {showPagination && data.length > 0 && (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded px-6 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  onClick={() =>
                    sortable &&
                    column.sortable !== false &&
                    handleSort(column.accessor)
                  }
                  className={`px-4 py-2 text-left text-gray-700 font-medium text-sm ${
                    sortable && column.sortable !== false
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  style={{ width: column.width }}
                >
                  <div
                    className={`flex items-center ${
                      column.align === "center"
                        ? "justify-center"
                        : column.align === "right"
                        ? "justify-end"
                        : ""
                    }`}
                  >
                    {column.header}
                    {sortable &&
                      column.sortable !== false &&
                      sortField === column.accessor && (
                        <span className="ml-1 text-gray-500">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${rowClassName ? rowClassName(row) : ""}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700 ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : ""
                      }`}
                    >
                      {column.renderCell
                        ? column.renderCell(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && data.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, data.length)}
            </span>{" "}
            of <span className="font-medium">{data.length}</span> results
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                  currentPage === page
                    ? "border-custom-yellow bg-custom-yellow text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                } ${page === "..." ? "cursor-default" : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
