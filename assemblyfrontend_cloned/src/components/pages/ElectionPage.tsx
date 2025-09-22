import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Modal from "../modal/Modal";
import CreateElectionForm from "../forms/CreateElectionForm";
import { getAllElections, activateElection } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { ElectionItem } from "../utils/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CircleX } from "lucide-react";
import { Button } from "../ui/button";

const ElectionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [elections, setElections] = useState<ElectionItem[]>([]);
  const [createElection, setCreateElection] = useState(false);
  const [loadingActivation, setLoadingActivation] = useState<number | null>(
    null
  );

  const filteredData = elections.filter(
    (election) =>
      election.name.toLowerCase().includes(search.toLowerCase()) ||
      election.createdBy.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      election.status.toLowerCase().includes(search.toLowerCase()) ||
      election.id.toString().includes(search)
  );

  const fetchElectionList = async () => {
    try {
      const response = await getAllElections();
      console.log("Response", response);
      setElections(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Fetching Data</span>
          </div>
        ),
        description:
          "Something went wrong while loading the election data. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleActivateElection = async (electionId: number) => {
    setLoadingActivation(electionId);
    try {
      await activateElection(electionId);
      toast({
        title: "Election Activated",
        description: `Election ID ${electionId} has been successfully activated.`,
        duration: 4000,
      });
      await fetchElectionList(); // Refresh the list to reflect the updated status
    } catch (error) {
      console.error("Error activating election:", error);
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Activating Election</span>
          </div>
        ),
        description: "Failed to activate the election. Please try again.",
        duration: 4000,
      });
    } finally {
      setLoadingActivation(null);
    }
  };

  useEffect(() => {
    fetchElectionList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2">
        <ArrowLeft size={18} />
        Back
      </Button>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            List of Elections
          </h1>
          <button
            className="bg-[#f1ab15] hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            onClick={() => setCreateElection(!createElection)}>
            + Create Election
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-[#f1ab15] h-5 w-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, status, or created by..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#f1ab15] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1ab15] text-gray-700"
          />
        </div>

        {/* Election List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredData.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredData.map((election) => (
                <li
                  key={election.id}
                  className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-[#f1ab15] transition cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    {/* Election Info */}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {election.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {election.id}</p>

                      {/* Status badge */}
                      <p className="text-sm">
                        Status:{" "}
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                            election.status === "OPEN"
                              ? "bg-green-100 text-green-700"
                              : election.status === "CLOSED"
                              ? "bg-blue-100 text-blue-700"
                              : election.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {election.status}
                        </span>
                      </p>

                      <p className="text-sm text-gray-600">
                        Date:{" "}
                        {new Date(election.electionDay).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created By:{" "}
                        <span className="font-medium">
                          {election.createdBy.fullName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Created At:{" "}
                        {new Date(election.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Button */}
                    {election.status.toLowerCase() !== "active" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivateElection(election.id);
                        }}
                        disabled={
                          loadingActivation === election.id ||
                          election.status === "OPEN"
                        }
                        className={`px-5 py-2.5 rounded-lg font-semibold text-white shadow-sm transition-all duration-200
    ${
      loadingActivation === election.id || election.status === "OPEN"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#f1ab15] hover:bg-yellow-600 cursor-pointer"
    }`}>
                        {loadingActivation === election.id
                          ? "Activating..."
                          : election.status === "OPEN"
                          ? "Already Open"
                          : "Activate"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-600 text-center">No elections found.</p>
          )}
        </div>
      </div>

      {/* Modal for Creating Election */}
      <Modal
        title="Election Creation Form"
        isOpen={createElection}
        onClose={() => setCreateElection(!createElection)}>
        <CreateElectionForm />
      </Modal>
    </div>
  );
};

export default ElectionsPage;
