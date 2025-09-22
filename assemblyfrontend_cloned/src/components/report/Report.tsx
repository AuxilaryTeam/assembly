import React, { useEffect, useState } from "react";
import axios from "axios";
import GenericTable, { Column } from "../GenericTable";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Shareholder {
  id: number;
  nameamh: string;
  nameeng: string;
  phone: string;
  shareholderid: string;
  paidcapital: number;
  totalcapital: number;
  sharesubsription: number;
  votingsubscription: number;
  devidend: number;
  attendance: number;
  fiscalyear: string;
}

const Report = () => {
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  // Ensure VITE_API_BASE_URL is defined in .env and env.d.ts
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchShareholders("present");
  }, []);

  const fetchShareholders = async (type: string) => {
    try {
      const endpoint = type === "all" ? "present" : type; // Use 'present' for 'all' as per second component
      const res = await axios.get<Shareholder[]>(
        `${apiBase}admin/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShareholders(res.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "No results found or an error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFilter = (type: "present" | "absent" | "all") => {
    fetchShareholders(type);
  };

  const filteredShareholders = shareholders.filter((s) =>
    s.nameeng.toLowerCase().includes(search.toLowerCase())
  );

  // GenericTable columns
  const columns: Column[] = [
    { header: "ID", accessor: "id", width: "w-12", align: "center" },
    { header: "Name (Amh)", accessor: "nameamh", width: "w-48" },
    { header: "Name (Eng)", accessor: "nameeng", width: "w-48" },
    { header: "Phone", accessor: "phone", width: "w-32" },
    { header: "Shareholder ID", accessor: "shareholderid", width: "w-32" },
    {
      header: "Paid Capital",
      accessor: "paidcapital",
      align: "right",
      renderCell: (val) => Intl.NumberFormat("en-US").format(val),
    },
    {
      header: "Total Capital",
      accessor: "totalcapital",
      align: "right",
      renderCell: (val) => Intl.NumberFormat("en-US").format(val),
    },
    {
      header: "Share Subscription",
      accessor: "sharesubsription",
      align: "right",
    },
    {
      header: "Voting Subscription",
      accessor: "votingsubscription",
      align: "right",
    },
    {
      header: "Dividend",
      accessor: "devidend",
      align: "right",
      renderCell: (val) => Intl.NumberFormat("en-US").format(val),
    },
    {
      header: "Attendance",
      accessor: "attendance",
      align: "center",
      renderCell: (val) => (val === 1 ? "Present" : "Absent"),
    },
    { header: "Fiscal Year", accessor: "fiscalyear", align: "center" },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header & Filter */}
      <Card className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 border-2 border-yellow-400">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Shareholder Report
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilter("present")}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
          >
            Present
          </button>
          <button
            onClick={() => handleFilter("absent")}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
          >
            Absent
          </button>
          <button
            onClick={() => handleFilter("all")}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
          >
            Total
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by English Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-gray-50"
        />
      </Card>

      {/* Table */}
      <Card className="bg-white shadow-xl rounded-2xl overflow-x-auto">
        <GenericTable
          data={filteredShareholders}
          columns={columns}
          title="Shareholder List"
          rowClassName={(row) =>
            row.attendance === 1
              ? "bg-green-50 hover:bg-green-100"
              : "hover:bg-gray-50"
          }
          defaultItemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20]}
          showPagination
          exportToExcel={true}
        />
      </Card>
    </div>
  );
};

export default Report;
