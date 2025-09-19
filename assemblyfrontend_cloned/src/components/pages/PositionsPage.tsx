import React, { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";
import type { IssueItem, PositionItem } from "../utils/types";
import Modal from "../modal/Modal";
import CreateIssueForm from "../forms/CreateIssueForm";
import { getActivePositions, getIssueList } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PositionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [issues, setIssues] = useState<PositionItem[]>([]);
  const [createIssue, setCreateIssue] = useState(false);
  const filteredData = issues.filter(
    (card) =>
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.description.toLowerCase().includes(search.toLowerCase())
  );

  const fetchPositionList = async () => {
    try {
      const response = await getActivePositions();
      console.log("reponse", response.data);
      setIssues(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" /> {/* error icon */}
            <span>Error Fetching Data</span>
          </div>
        ),
        description:
          "Something went wrong while loading the data. Please try again.",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchPositionList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-2 mb-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1 className="text-3xl font-bold  text-gray-800 ">
            List of Active Positions
          </h1>
          {/* Create Button */}
          <button
            className="bg-[#f1ab15] hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded shadow transition cursor-pointer"
            onClick={() => {
              setCreateIssue(!createIssue);
            }}>
            + Create Position
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-[#f1ab15]" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#f1ab15] rounded-lg 
                   focus:outline-none focus:ring-1 focus:ring-[#f1ab15]"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/positions/${item.id}`)}
            className="bg-[#f1ab1544] hover:bg-[#f1ab15b4] cursor-pointer p-4 rounded text-center">
            <p className="font-bold">{item.name}</p>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={createIssue}
        onClose={function (): void {
          setCreateIssue(!createIssue);
        }}>
        <CreateIssueForm />
      </Modal>
    </div>
  );
};
export default PositionsPage;
