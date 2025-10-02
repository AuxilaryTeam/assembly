import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FiPrinter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";
import { useToast } from "@/hooks/use-toast";

export interface VoteLogType {
  id: number;
  timestamp: string;
  attendeeCount: number;
  totalShare: number;
  attendeeShareCount: number;
}

const PrintPrevDisplays = () => {
  const [printLogs, setPrintLogs] = useState<VoteLogType[]>([]);
  const [selectedLog, setSelectedLog] = useState<VoteLogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const fetchPrintLogs = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}admin/printlog`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrintLogs(response.data);
      return true;
    } catch (err) {
      console.error("Error fetching print logs:", err);
      toast({
        title: "Data Fetch Failed",
        description: "Could not retrieve print logs",
        variant: "destructive",
      });
      return false;
    }
  }, [token, toast]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchPrintLogs();
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Error updating data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPrintLogs]);

  const printDocument = (log: VoteLogType) => {
    setSelectedLog(log);

    window.print();
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  const getPercentage = (log: VoteLogType) =>
    log.totalShare > 0
      ? ((log.attendeeShareCount / log.totalShare) * 100).toFixed(2)
      : "0.00";

  // Pagination logic
  const totalPages = Math.ceil(printLogs.length / itemsPerPage);
  const paginatedLogs = printLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Control Panel (Hidden when printing) */}
      <div className="print:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">
            Shareholders Meeting - Previous Print Logs
          </h1>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Updating..." : "Refresh Data"}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Last updated: {lastUpdated || "Never"} | Data refreshes automatically
          every 15 seconds
        </p>

        {/* Print Logs Table for Viewing and Selection */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Print Logs History
          </h2>
          {printLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">ID</th>
                    <th className="px-4 py-2 border-b text-left">Timestamp</th>
                    <th className="px-4 py-2 border-b text-left">
                      Attendee Count
                    </th>
                    <th className="px-4 py-2 border-b text-left">
                      Total Shares
                    </th>
                    <th className="px-4 py-2 border-b text-left">
                      Attendee Share Count
                    </th>
                    <th className="px-4 py-2 border-b text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-2 border-b">{log.id}</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {Intl.NumberFormat("en-US").format(log.attendeeCount)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {Intl.NumberFormat("en-US").format(log.totalShare)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {Intl.NumberFormat("en-US").format(
                          log.attendeeShareCount
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => printDocument(log)}
                          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <FiPrinter />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 flex items-center gap-2"
                >
                  <FiChevronLeft />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No print logs available yet.</p>
          )}
        </div>
      </div>

      {/* Printable Document (Selected Log) */}
      {selectedLog && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-2 border-gray-300 print:border-0 print:shadow-none">
          {/* Bank Letterhead */}
          <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-6">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Bank of Abyssinia Logo"
                className="h-16 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">አቢሲኒያ ባንክ</h1>
                <p className="text-md text-gray-700">የባለአክሲዮኖች ጉባኤ</p>
              </div>
            </div>
            <img
              src={slogan}
              alt="Bank of Abyssinia Slogan"
              className="h-10 w-auto"
            />
          </div>

          {/* Meeting Details */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">የስብሰባ ቀን:</span>{" "}
                {new Date(selectedLog.timestamp).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">የስብሰባ መለያ:</span>{" "}
                BOA-SH-2023-001
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">ሰነድ የተጻፈበት ቀን:</span>{" "}
                {new Date(selectedLog.timestamp).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">ያጸደቀው ባለሥልጣን:</span> የጉባኤ ፀሃፊ
              </p>
            </div>
          </div>

          {/* Official Statistics in the new card-like layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attendance Count Metric */}
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
              <p className="text-base font-bold text-gray-700 mb-2">
                ለስብሰባ የተገኙ የባለአክሲዮኖች ብዛት
              </p>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {Intl.NumberFormat("en-US").format(selectedLog.attendeeCount)}
              </p>
            </div>

            {/* Subscribed Shares Metric */}
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
              <p className="text-base font-bold text-gray-700 mb-2">
                አጠቃላይ የተፈረመ አክሲዮን ካፒታል
              </p>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {Intl.NumberFormat("en-US").format(selectedLog.totalShare)}
              </p>
            </div>

            {/* Attended Subscribed Shares Metric */}
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
              <p className="text-base font-bold text-gray-700 mb-2">
                የተገኙ አክሲዮኖች (በቁጥር)
              </p>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {Intl.NumberFormat("en-US").format(
                  selectedLog.attendeeShareCount
                )}
              </p>
            </div>

            {/* Percentage Metric */}
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center">
              <p className="text-base font-bold text-gray-700 mb-2">
                የተገኙ አክሲዮኖች (%)
              </p>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {getPercentage(selectedLog)}%
              </p>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div
                className="border-t-2 border-gray-400 pt-4 mx-auto"
                style={{ width: "80%" }}
              >
                <p className="font-semibold">የጉባኤው ፕሬዚደንት</p>
                <p className="text-sm text-gray-600">ስም እና ፊርማ</p>
              </div>
            </div>
            <div className="text-center">
              <div
                className="border-t-2 border-gray-400 pt-4 mx-auto"
                style={{ width: "80%" }}
              >
                <p className="font-semibold">የጉባኤው ፀሃፊ</p>
                <p className="text-sm text-gray-600">ስም እና ፊርማ</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-500 border-t pt-4">
            <p>ይህ የባንክ አቢሲኒያ ባንክ - የባለአክሲዮኖች ጉባኤ ኦፊሴላዊ ሰነድ ነው</p>
            <p>
              ቀን {new Date(selectedLog.timestamp).toLocaleString()} | የሰነድ መለያ:{" "}
              {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Print Instructions (Hidden when printing) */}
      <div className="print:hidden mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-4xl mx-auto">
        <h3 className="font-bold text-yellow-800 mb-2">
          Printing Instructions:
        </h3>
        <ul className="list-disc list-inside text-yellow-700 text-sm">
          <li>
            Select a print log from the table and click "Print" to generate a
            printable version
          </li>
          <li>
            Ensure the document includes all borders and background colors in
            print preview
          </li>
          <li>Use quality paper for official records</li>
          <li>
            Have both the Chairperson and Secretary sign the document after
            printing
          </li>
          <li>
            File this document as an official record of the shareholders meeting
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrintPrevDisplays;
