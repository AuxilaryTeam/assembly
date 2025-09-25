import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import SearchCard from "../SearchCard";
import { Checkbox } from "../ui/checkbox";
import GenericTable, { Column, getRemark } from "../GenericTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { Gavel, Printer } from "lucide-react";
import { rowClassName } from "./Searchprint";

interface Shareholder {
  id: number;
  nameamh: string;
  nameeng: string;
  shareholderid: string;
  phone: string;
  attendance: number;
  attendanceTimestamp: string | null;
  votingsubscription: number;
  sharesubsription: number;
  paidcapital: number;
  totalcapital: number;
  devidend: number;
}

const apiBase = import.meta.env.VITE_API_BASE_URL;

const Search = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<Shareholder[]>([]);
  const [itemsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShareholder, setSelectedShareholder] =
    useState<Shareholder | null>(null);
  const [isMarking, setIsMarking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token || token.includes("<!DOCTYPE html") || token.includes("<html")) {
      localStorage.removeItem("token");
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="h-4 w-4" />
            <span>Session Expired</span>
          </div>
        ),
        description: "Your session has expired. Please login again.",
        duration: 4000,
      });
      setTimeout(() => {
        navigate("/", {
          replace: true,
          state: { showToast: true },
        });
      }, 1000);
      return null;
    }
    return token;
  };

  const fetchData = async (
    type: "name" | "phone" | "shareid",
    query: string
  ) => {
    setResult([]);
    setError(null);
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${apiBase}admin/${type}/${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      const data: Shareholder[] = Array.isArray(response.data)
        ? response.data
        : [response.data];

      console.log("Response", response.data);

      if (data.length === 0) {
        setError("No results found for your search");
        toast({
          title: "No results found",
          variant: "default",
          description: "Please try a different search term.",
        });
      } else {
        toast({
          title: `Found ${data.length} result(s)`,
          variant: "success",
          description: "Search completed successfully.",
        });
      }
      setResult(data);
      // Check for remarks
      const hasLegal = data.some((s) => getRemark(s) === "To Legal");
      const hasOnlyPrint = data.some((s) => getRemark(s).includes("Only"));
      if (hasLegal) {
        toast({
          title: "Legal Notice",
          description: (
            <div className="flex items-center space-x-2">
              <FiAlertTriangle className="h-4 w-4" />
              <span>Some shareholders require legal processing.</span>
            </div>
          ),
          variant: "destructive",
          duration: 5000,
        });
      }

      if (hasOnlyPrint) {
        toast({
          title: "Notice: Only Print",
          description: (
            <div className="flex items-center space-x-2">
              <Printer className="h-4 w-4" />
              <span>Some shareholders are marked as print-only.</span>
            </div>
          ),
          variant: "warning",
          duration: 5000,
        });
      }
    } catch (err: any) {
      console.error("API Error:", err);
      toast({
        title: "Search Error",
        variant: "destructive",
        description: "An error occurred while fetching data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }
    setError(null);

    if (query.startsWith("9")) fetchData("phone", query);
    else if (isNaN(Number(query))) fetchData("name", query);
    else fetchData("shareid", query);
  };

  const handleAttendanceClick = (shareholder: Shareholder) => {
    setSelectedShareholder(shareholder);
    setIsMarking(shareholder.attendance === 0);
    setModalOpen(true);
  };

  const handleConfirmAttendance = async () => {
    if (!selectedShareholder) return;
    console.log("Is Marking", isMarking);

    const token = getAuthToken();
    if (!token) {
      setModalOpen(false);
      return;
    }

    const now = new Date().toLocaleString();

    try {
      await axios.post(
        `${apiBase}admin/attendance${isMarking ? "" : "0"}/${
          selectedShareholder.id
        }`,
        { attendance: isMarking ? 1 : 0 },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      setResult((prev) =>
        prev.map((s) =>
          s.id === selectedShareholder.id
            ? {
                ...s,
                attendance: isMarking ? 1 : 0,
                attendanceTimestamp: isMarking ? now : null,
              }
            : s
        )
      );

      setModalOpen(false);

      toast({
        title: `Attendance ${isMarking ? "marked" : "unmarked"} successfully!`,
        variant: "success",
        description: isMarking
          ? "The shareholder's attendance has been recorded."
          : "The shareholder's attendance has been removed.",
      });

      if (isMarking) {
        navigate("/print", {
          state: {
            person: {
              ...selectedShareholder,
              attendance: 1,
              attendanceTimestamp: now,
            },
          },
        });
      }
    } catch (error) {
      console.error("Attendance Error:", error);
      toast({
        title: "Error updating attendance",
        variant: "destructive",
        description: "Please try again or contact support.",
      });
    }
  };

  const columns: Column[] = [
    {
      header: "SR No.",
      accessor: "id",
      align: "center",
      width: "w-12",
      sortable: true,
    },
    {
      header: "Attendance",
      accessor: "attendance",
      align: "center",
      width: "w-24",
      renderCell: (value, row) =>
        row.votingsubscription > 0 && row.sharesubsription > 0 ? (
          <Checkbox
            checked={value === 1}
            onCheckedChange={() => handleAttendanceClick(row)}
            disabled={loading}
          />
        ) : (
          "-"
        ),
    },
    {
      header: "Remark",
      accessor: "remark",
      align: "center",
      width: "w-32",
      renderCell: (value, row) =>
        row.votingsubscription === 0 && row.sharesubsription === 0
          ? "Only Dividend"
          : row.votingsubscription > 0 && row.sharesubsription > 0
          ? ""
          : "To Legal",
    },
    {
      header: "Name (Amh)",
      accessor: "nameamh",
      width: "w-48",
      sortable: true,
    },
    {
      header: "Name (Eng)",
      accessor: "nameeng",
      width: "w-48",
      sortable: true,
    },
    {
      header: "Shareholder ID",
      accessor: "shareholderid",
      align: "center",
      width: "w-32",
      sortable: true,
    },
    {
      header: "Phone",
      accessor: "phone",
      align: "center",
      width: "w-36",
      sortable: true,
    },
    {
      header: "Attendance Time",
      accessor: "attendanceTimestamp",
      align: "center",
      width: "w-48",
      renderCell: (value) =>
        value !== null && typeof value === "string"
          ? value.split("T").join(" ")
          : "-",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <SearchCard
        label="Search For Attendance"
        placeholder="Enter ID, Name, or Phone"
        onSearch={handleSearch}
        loading={loading}
        error={error}
      />

      {result.length > 0 && (
        <Card className="bg-white shadow-xl rounded-2xl max-w-7xl mx-auto overflow-x-auto">
          <GenericTable
            data={result}
            columns={columns}
            title="Search Results"
            defaultItemsPerPage={itemsPerPage}
            itemsPerPageOptions={[5, 10, 20]}
            rowClassName={rowClassName}
            emptyMessage="No data available"
            showPagination
            sortable
          />
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              {isMarking ? (
                <>
                  <FiCheckCircle className="text-green-500" />
                  Mark Attendance?
                </>
              ) : (
                <>
                  <FiAlertTriangle className="text-amber-500" />
                  Unmark Attendance?
                </>
              )}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-700">
              Confirm attendance action for:
              <div className="mt-2 space-y-1">
                <p>
                  <strong>Name:</strong> {selectedShareholder?.nameeng}
                </p>
                <p>
                  <strong>Shareholder ID:</strong>{" "}
                  {selectedShareholder?.shareholderid}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedShareholder?.phone}
                </p>
                <p>
                  <strong>Current Attendance:</strong>{" "}
                  {selectedShareholder?.attendance === 1
                    ? "Marked"
                    : "Not marked"}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleConfirmAttendance}
              disabled={loading}
            >
              {isMarking ? "Mark & Print" : "Unmark"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
