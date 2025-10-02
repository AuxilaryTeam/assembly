import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Assuming these API functions exist and return similar data structures
import {
  getActivePositions as getPolls,
  getIssueList as getProposals,
} from "../utils/api";

// Define a shared type for polls and proposals
interface PollOrProposalItem {
  id: string;
  description: string;
  title?: string;
  name?: string;
}

const PollProposalSelectorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<PollOrProposalItem[]>([]);
  const [type, setType] = useState<"polls" | "proposals">("polls"); // Default to polls

  // Filter items based on search input
  const filteredData = items.filter(
    (item) =>
      (item.name
        ? item.name.toLowerCase().includes(search.toLowerCase())
        : true) ||
      (item.title
        ? item.title.toLowerCase().includes(search.toLowerCase())
        : true) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch data based on selected type (polls or proposals)
  const fetchItems = async () => {
    try {
      const response = await (type === "polls" ? getPolls() : getProposals());
      console.log("Response ", response);
      setItems(response.data);
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

  // Fetch data when type changes
  useEffect(() => {
    fetchItems();
  }, [type]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-2 mb-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            Select {type === "polls" ? "Polls" : "Proposals"}
          </h1>
          {/* Dropdown Selector */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "polls" | "proposals")}
            className="bg-[#f1ab15] hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded shadow transition cursor-pointer">
            <option value="polls">Polls</option>
            <option value="proposals">Proposals</option>
          </select>
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
            onClick={() => window.open(`${type}/${item.id}`, "_blank")}
            className="bg-[#f1ab1544] hover:bg-[#f1ab15b4] cursor-pointer p-4 rounded text-center">
            {type === "polls" ? (
              <p className="font-bold">{item.name ?? ""}</p>
            ) : (
              <p className="font-bold">{item.title ?? ""}</p>
            )}

            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollProposalSelectorPage;
