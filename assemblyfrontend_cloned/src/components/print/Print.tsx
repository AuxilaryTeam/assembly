import React, { useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPrinter, FiArrowLeft, FiFileText } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import GenericPrint from "./GenericPrint";
import { useReactToPrint } from "react-to-print";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Print = () => {
  const location = useLocation();
  const { person } = location.state || {};
  const navigate = useNavigate();

  const allRef = useRef<HTMLDivElement>(null);
  const dividendRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);

  const printAll = useReactToPrint({
    contentRef: allRef,
  });

  const printDividend = useReactToPrint({
    contentRef: dividendRef,
    onBeforePrint: async () => {
      return new Promise((resolve) => setTimeout(resolve, 0));
    },
  });

  const printPayment = useReactToPrint({
    contentRef: paymentRef,
    onBeforePrint: async () => {
      return new Promise((resolve) => setTimeout(resolve, 0));
    },
  });

  const printVote = useReactToPrint({
    contentRef: voteRef,
    onBeforePrint: async () => {
      return new Promise((resolve) => setTimeout(resolve, 0));
    },
  });

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 font-abyssinica">
      {/* Control Panel - Fixed and Static on Scroll */}
      <div className="print:hidden fixed top-20 left-72 right-10 z-50 bg-white p-2 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-left max-w-4xl mx-auto gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 font-overpass">
              <FiFileText /> Print Documents for:{" "}
              <span className="border-b-2 border-black text-center">
                {person?.nameeng}
              </span>
            </h1>
          </div>

          <div className="flex gap-2">
            {/* Back */}
            <Button
              onClick={goBack}
              className="flex items-center gap-2 font-overpass"
            >
              <FiArrowLeft /> Go Back
            </Button>
            {/* Print All with dropdown */}
            <div className="relative inline-flex">
              {/* Main Print All Button */}
              <Button
                onClick={printDividend}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-r-none font-overpass"
              >
                <FiPrinter /> Print Dividend
              </Button>
              {/* Dropdown Trigger (Chevron) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center bg-green-600 text-white hover:bg-green-700 rounded-l-none px-2 font-overpass"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={printPayment}
                    className="font-overpass"
                  >
                    Print Payment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={printVote}
                    className="font-overpass"
                  >
                    Print Vote
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={printAll}
                    className="font-overpass"
                  >
                    Print All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area, with padding to account for the fixed header */}
      <div className="pt-24 p-4 mt-30 md:p-8">
        {/* Hidden print content */}
        <div className="block mt-10">
          <div ref={allRef}>
            {/* Dividend */}
            <div ref={dividendRef}>
              <GenericPrint person={person} documentType="dividend">
                <div className="mb-24 text-sm space-y-4 p-2 print:p-2"></div>
              </GenericPrint>
            </div>

            {/* Payment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
