import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { OptionsType } from "./types";
import BoALogo from "../../assets/BOA logo white.svg";

// System Tityel
export const SystemTitle = () => {
  return (
    <div className="w-1/2 bg-[#f1ab15] flex flex-col justify-center items-center p-10">
      <img
        src={BoALogo}
        alt="Logo of bank of abyssinia"
        className="h-24 w-100 mb-6"
      />
      <p className="text-3xl font-bold text-white leading-relaxed text-center">
        Share Holders <br /> Vote System
      </p>
    </div>
  );
};

// Card and CardContent
export const Card = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="bg-white rounded-lg shadow p-4" {...props}>
    {children}
  </div>
);

export const CardContent = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;

// Select and SelectItem
export const Select = ({ value, onValueChange, children }: any) => (
  <select
    className="border rounded px-2 py-1"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}>
    {children}
  </select>
);

export const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);

// Table
export const Table = ({ title, columns, data }: any) => (
  <div>
    {title && <h3 className="font-bold mb-2">{title}</h3>}
    <table className="min-w-full border">
      <thead>
        <tr>
          {columns.map((col: string) => (
            <th key={col} className="border px-2 py-1">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row: any, i: number) => (
            <tr key={i}>
              {columns.map((col: string) => (
                <td key={col} className="border px-2 py-1">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-2">
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Chart placeholders
export const LineChart = ({ title }: any) => (
  <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col items-center justify-center">
    <div className="font-bold mb-2">{title}</div>
    <div className="text-gray-400">[Line Chart Placeholder]</div>
  </div>
);

export const BarChart = ({ title }: any) => (
  <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col items-center justify-center">
    <div className="font-bold mb-2">{title}</div>
    <div className="text-gray-400">[Bar Chart Placeholder]</div>
  </div>
);

export const PieChart = ({ title }: any) => (
  <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col items-center justify-center">
    <div className="font-bold mb-2">{title}</div>
    <div className="text-gray-400">[Pie Chart Placeholder]</div>
  </div>
);

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  formatNumber?: boolean;
  type?: "text" | "number" | "date";
  render?: (row: any, rowIdx?: number) => React.ReactNode;
}

interface SortTableProps {
  columns: Column[];
  data: any[];
  defaultSortKey?: string;
  numericColumns?: boolean;
  enableAddRowForm?: boolean;
  onSaveRow?: (row: any) => void;
  onClick?: (row: any) => void;
}

export const SortTable: React.FC<SortTableProps> = ({
  columns,
  data,
  defaultSortKey,
  numericColumns = true,
  enableAddRowForm = false,
  onSaveRow,
  onClick,
}) => {
  const [sortKey, setSortKey] = useState<string>(
    defaultSortKey || columns[0].key
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [newRows, setNewRows] = useState<any[]>([]);

  const { register, handleSubmit, reset, getValues } = useForm();

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortKey, sortDirection]);

  // Add a new empty row to the form
  const handleAddRow = () => {
    setNewRows((prev) => [...prev, {}]);
  };

  // Save all new rows
  const handleSaveAll = () => {
    const values = getValues();
    const rowsToSave = newRows.map((_, idx) => {
      const row: any = {};
      columns.forEach((col) => {
        row[col.key] = values[`${col.key}_${idx}`];
      });
      return row;
    });
    if (onSaveRow) onSaveRow(rowsToSave);
    setNewRows([]);
    reset();
  };

  // Clear all new rows
  const handleClearAll = () => {
    setNewRows([]);
    reset();
  };

  useEffect(() => {
    console.log("Sort key", sortKey);
  }, [sortKey]);

  return (
    <div className="max-w-fit overflow-x-auto w-full">
      <table className="min-w-fit border-collapse text-sm">
        <thead className="bg-yellow-500 text-white sticky top-0 z-10">
          <tr>
            {numericColumns && (
              <th className="p-2 text-center" style={{ width: "40px" }}>
                No
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={`p-2 text-left cursor-pointer ${
                  col.sortable !== false ? "" : "cursor-default"
                }`}
                onClick={() => col.sortable !== false && handleSort(col.key)}>
                {col.label}
                {col.sortable !== false && sortKey === col.key && (
                  <span className="text-[10px] ml-1">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              className="border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => onClick?.(row)}>
              {numericColumns && <td className="p-2 text-center">{idx + 1}</td>}
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className="px-5 py-3 text-wrap ">
                  {col.render
                    ? col.render(row)
                    : col.formatNumber && typeof row[col.key] === "number"
                    ? row[col.key] === 0 || row[col.key] === null
                      ? "-"
                      : formatNumber(row[col.key])
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {/* New rows form at the bottom */}
          {enableAddRowForm &&
            newRows.map((_, idx) => (
              <tr key={`new-row-${idx}`}>
                {numericColumns && <td className="p-2 text-center">-</td>}
                {columns.map((col) => (
                  <td key={col.key} className="p-2 text-center">
                    {col.render ? (
                      "-"
                    ) : (
                      <input
                        {...register(`${col.key}_${idx}`)}
                        className="border px-1 py-0.5 rounded w-full"
                        type={col.formatNumber ? "number" : "text"}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {enableAddRowForm && (
        <div className="flex justify-between mt-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleAddRow}
            type="button">
            Add Row
          </button>
          {newRows.length > 0 && (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleSubmit(handleSaveAll)}
                type="button">
                Save All
              </button>
              <button
                className="bg-gray-300 text-black px-3 py-1 rounded"
                onClick={handleClearAll}
                type="button">
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const formatNumber = (num: number): string => {
  if (typeof num !== "number" || isNaN(num)) return "";
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return num < 0 ? `(${formatted})` : formatted;
};

export function downloadCSV(data: any[], filename: string) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  for (const row of data) {
    csvRows.push(headers.map((h) => `"${row[h]}"`).join(","));
  }
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = filename;
  link.click();
}

// Currency data placeholder all currency
export const currencyData: OptionsType[] = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "JPY", label: "Japanese Yen" },
  { value: "GBP", label: "British Pound" },
  { value: "AUD", label: "Australian Dollar" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "CHF", label: "Swiss Franc" },
  { value: "CNY", label: "Chinese Yuan" },
  { value: "SEK", label: "Swedish Krona" },
  { value: "NZD", label: "New Zealand Dollar" },
];

export const requestTypeData: OptionsType[] = [
  { value: "Import LC", label: "Import LC" },
  { value: "Export LC", label: "Export LC" },
  { value: "Advance Payment", label: "Advance Payment" },
  { value: "Telegraphic Transfer (TT)", label: "Telegraphic Transfer (TT)" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  {
    value: "Cash Against Document (CAD)",
    label: "Cash Against Document (CAD)",
  },
  { value: "FCY Allocation Request", label: "FCY Allocation Request" },
  { value: "Loan / Credit Request", label: "Loan / Credit Request" },
  { value: "Remittance", label: "Remittance" },
  { value: "Personal Use", label: "Personal Use" },
];
