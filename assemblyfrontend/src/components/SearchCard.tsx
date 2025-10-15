import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiSearch, FiAlertCircle } from "react-icons/fi";

interface SearchCardProps {
  label: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean; // Added disabled prop
}

const SearchCard: React.FC<SearchCardProps> = ({
  label,
  placeholder = "Enter search term",
  onSearch,
  loading = false,
  error = null,
  disabled = false, // Default to false
}) => {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim() || disabled) return; // Prevent search when disabled
    onSearch(search);
  };

  return (
    <Card
      className={`bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-lg border-amber-300 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <CardContent>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-gray-800">
          {label}
        </h2>
        <form
          className="flex flex-col md:flex-row gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder={disabled ? "Feature disabled" : placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
            disabled={disabled || loading} // Disable when either disabled prop is true or loading
          />
          <Button
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            type="submit"
            disabled={disabled || loading} // Disable when either disabled prop is true or loading
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </>
            ) : disabled ? (
              "Disabled"
            ) : (
              <>
                <FiSearch /> Search
              </>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
        {disabled && !error && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-600 text-sm font-medium">
              This feature is currently disabled
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchCard;
