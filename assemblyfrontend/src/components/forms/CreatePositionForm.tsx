import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPosition, getAllElections } from "../utils/api";
import type { PositionRequest, ElectionItem } from "../utils/types";
import { useToast } from "@/hooks/use-toast";
import { CircleX } from "lucide-react";
import { FaSearch } from "react-icons/fa";

const CreatePositionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PositionRequest>();
  const { toast } = useToast();
  const [elections, setElections] = useState<ElectionItem[]>([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<ElectionItem | null>(
    null
  );

  // Fetch active/open elections
  const fetchElections = async () => {
    try {
      const response = await getAllElections();
      // Filter for active or open elections
      const activeElections = response.data.filter(
        (election: ElectionItem) =>
          election.status.toLowerCase() === "active" ||
          election.status.toLowerCase() === "open"
      );
      setElections(activeElections);
    } catch (error) {
      console.error("Error fetching elections:", error);
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Fetching Elections</span>
          </div>
        ),
        description: "Failed to load elections. Please try again.",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  // Filter elections based on search input
  const filteredElections = elections.filter(
    (election) =>
      election.name.toLowerCase().includes(search.toLowerCase()) ||
      new Date(election.electionDay)
        .toLocaleDateString()
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Handle election selection
  const handleSelectElection = (election: ElectionItem) => {
    setSelectedElection(election);
    setValue("electionId", election.id, { shouldValidate: true }); // Set electionId and trigger validation
    setIsDropdownOpen(false);
    setSearch(""); // Clear search after selection
  };

  const onSubmit: SubmitHandler<PositionRequest> = async (data) => {
    try {
      const response = await createPosition(data);
      console.log("Position created:", response.data);
      toast({
        title: "Position Created",
        description: "The position has been successfully created.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error creating position:", error);
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span>Error Creating Position</span>
          </div>
        ),
        description: "Failed to create the position. Please try again.",
        duration: 4000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md mx-auto p-4 flex flex-col justify-end">
      {/* Position Name Input */}
      <div>
        <label htmlFor="name" className="block font-medium text-gray-700">
          Position Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register("name", { required: "Position name is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="block font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Maximum Votes Input */}
      <div>
        <label htmlFor="maxVotes" className="block font-medium text-gray-700">
          Maximum Votes <span className="text-red-500">*</span>
        </label>
        <input
          id="maxVotes"
          type="number"
          {...register("maxVotes", {
            required: "Maximum votes is required",
            min: { value: 1, message: "Maximum votes must be at least 1" },
          })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />
        {errors.maxVotes && (
          <p className="text-red-500 text-sm">{errors.maxVotes.message}</p>
        )}
      </div>

      {/* Maximum Candidates Input */}
      <div>
        <label
          htmlFor="maxCandidates"
          className="block font-medium text-gray-700">
          Maximum Candidates <span className="text-red-500">*</span>
        </label>
        <input
          id="maxCandidates"
          type="number"
          {...register("maxCandidates", {
            required: "Maximum candidates is required",
            min: { value: 1, message: "Maximum candidates must be at least 1" },
          })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />
        {errors.maxCandidates && (
          <p className="text-red-500 text-sm">{errors.maxCandidates.message}</p>
        )}
      </div>

      {/* Election Dropdown */}
      <div>
        <label htmlFor="electionId" className="block font-medium text-gray-700">
          Election <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15] cursor-pointer"
            placeholder="Select an election..."
            value={
              selectedElection
                ? `${selectedElection.name} (${new Date(
                    selectedElection.electionDay
                  ).toLocaleDateString()})`
                : ""
            }
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            readOnly
          />
          {errors.electionId && (
            <p className="text-red-500 text-sm">{errors.electionId.message}</p>
          )}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border border-[#f1ab15] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {/* Search Bar for Dropdown */}
              <div className="relative p-2">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <FaSearch className="text-[#f1ab15] h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search elections..."
                  className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f1ab15]"
                />
              </div>
              {/* Election List */}
              {filteredElections.length > 0 ? (
                filteredElections.map((election) => (
                  <div
                    key={election.id}
                    onClick={() => handleSelectElection(election)}
                    className="p-2 hover:bg-[#f1ab1544] cursor-pointer">
                    <p className="text-sm text-gray-700">
                      {election.name} (
                      {new Date(election.electionDay).toLocaleDateString()})
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-2 text-sm text-gray-500">
                  No active elections found
                </p>
              )}
            </div>
          )}
        </div>
        {/* Hidden input for electionId */}
        <input
          type="hidden"
          {...register("electionId", { required: "Election is required" })}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#f1ab15] hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
        {isSubmitting ? "Submitting..." : "Create Position"}
      </button>
    </form>
  );
};

export default CreatePositionForm;
