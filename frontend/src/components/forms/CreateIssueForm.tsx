import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createIssue } from "../utils/api";
import type { IssueRequest } from "../utils/types";

const CreateIssueForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueRequest>();

  const onSubmit: SubmitHandler<IssueRequest> = async (data) => {
    try {
      const response = await createIssue(data); // Replace with your endpoint
      console.log("Issue created:", response.data);
      alert("Issue created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create issue");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-md mx-auto p-4 flex flex-col justify-end">
      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
          className="w-full border border-[#f1ab15] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f1ab15]"
        />

        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#f1ab15] hover:bg-yellow-600 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Create Issue"}
      </button>
    </form>
  );
};

export default CreateIssueForm;
