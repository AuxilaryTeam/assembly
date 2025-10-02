import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createElection, getAllElections } from "../utils/api"; // adjust path

type ElectionRequest = {
  name: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  electionDay: string; // YYYY-MM-DD (LocalDate)
};

const CreateElectionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ElectionRequest>({
    defaultValues: {
      status: "INACTIVE",
      electionDay: "", // let user pick
      name: "",
    },
  });

  const fetchActiveElections = async () => {
    try {
      const response = await getAllElections();
      console.log("response", response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchActiveElections();
  }, []);

  const onSubmit: SubmitHandler<ElectionRequest> = async (data) => {
    try {
      // data.electionDay already in YYYY-MM-DD from <input type="date">
      const payload = {
        name: data.name.trim(),
        status: data.status,
        electionDay: data.electionDay, // e.g. "2025-09-22"
      };

      const res = await createElection(payload);
      console.log("Election created:", res.data);
      alert("Election created successfully");
    } catch (err: any) {
      console.error("Failed to create election", err);
      alert(err?.response?.data?.message || "Failed to create election");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl mx-auto p-4 flex flex-col">
      <div>
        <label htmlFor="name" className="block font-medium">
          Election name
        </label>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block font-medium">
          Status
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]">
          <option value="DRAFT">DRAFT</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="electionDay" className="block font-medium">
          Election date
        </label>
        <input
          id="electionDay"
          type="date"
          {...register("electionDay", { required: "Election day is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />
        {errors.electionDay && (
          <p className="text-red-500 text-sm">{errors.electionDay.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#f1ab15] hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer w-fit">
        {isSubmitting ? "Submitting..." : "Create Election"}
      </button>
    </form>
  );
};

export default CreateElectionForm;
