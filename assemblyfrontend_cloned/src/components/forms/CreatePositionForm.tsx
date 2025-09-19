import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPosition } from "../utils/api";
import type { PositionRequest } from "../utils/types";

const CreatePositionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PositionRequest>();

  const onSubmit: SubmitHandler<PositionRequest> = async (data) => {
    try {
      const response = await createPosition(data);
      console.log("Position created:", response.data);
      alert("Position created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create position");
    }
  };

  return (
    <div className="space-y-4 w-md mx-auto p-4 flex flex-col justify-end">
      <div>
        <label htmlFor="name" className="block font-medium">
          Position Name
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

      <div>
        <label htmlFor="description" className="block font-medium">
          Description
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

      <div>
        <label htmlFor="maxVotes" className="block font-medium">
          Maximum Votes
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

      <div>
        <label htmlFor="maxCandidates" className="block font-medium">
          Maximum Candidates
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

      <button
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="bg-[#f1ab15] hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer">
        {isSubmitting ? "Submitting..." : "Create Position"}
      </button>
    </div>
  );
};

export default CreatePositionForm;
