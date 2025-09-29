import React, { useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPrinter, FiArrowLeft, FiFileText } from "react-icons/fi";
import GenericPrint from "./GenericPrint";
import { useReactToPrint } from "react-to-print";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Print = () => {
  const location = useLocation();
  const { person } = location.state || {};
  const navigate = useNavigate();

  const allRef = useRef(null);
  const dividendRef = useRef(null);
  const paymentRef = useRef(null);
  const voteRef = useRef(null);

  const printAll = useReactToPrint({
    contentRef: allRef,
    pageStyle: `
      @page { margin: 0 !important; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
        .slogan-image { height: 32px !important; width: auto !important; }
        .logo-image { height: 48px !important; width: auto !important; }
      }
    `,
    documentTitle: '',
    onBeforePrint: () => new Promise((resolve) => setTimeout(resolve, 500)), // Increased timeout
    preserveAfterPrint: true, // Debug mode, remove after testing
  });

  const printDividend = useReactToPrint({
    contentRef: dividendRef,
    pageStyle: `
      @page { margin: 0 !important; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
        .slogan-image { height: 32px !important; width: auto !important; }
        .logo-image { height: 48px !important; width: auto !important; }
      }
    `,
    documentTitle: 'Dividend Document',
    onBeforePrint: () => new Promise((resolve) => setTimeout(resolve, 500)),
    preserveAfterPrint: true,
  });

  const printPayment = useReactToPrint({
    contentRef: paymentRef,
    pageStyle: `
      @page { margin: 0 !important; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
        .slogan-image { height: 32px !important; width: auto !important; }
        .logo-image { height: 48px !important; width: auto !important; }
      }
    `,
    documentTitle: 'Payment Document',
    onBeforePrint: () => new Promise((resolve) => setTimeout(resolve, 500)),
    preserveAfterPrint: true,
  });

  const printVote = useReactToPrint({
    contentRef: voteRef,
    pageStyle: `
      @page { margin: 0 !important; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; }
        .slogan-image { height: 32px !important; width: auto !important; }
        .logo-image { height: 48px !important; width: auto !important; }
      }
    `,
    documentTitle: 'Vote Document',
    onBeforePrint: () => new Promise((resolve) => setTimeout(resolve, 500)),
    preserveAfterPrint: true,
  });

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 font-abyssinica">
      <div className="print:hidden fixed top-20 left-72 right-10 z-50 bg-white p-2 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-left max-w-4xl mx-auto gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 font-overpass">
              <FiFileText /> Print Documents for:{" "}
              <span className="border-b-2 border-black text-center">
                {person?.nameeng || 'Unknown'}
              </span>
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={goBack}
              className="flex items-center gap-2 font-overpass"
            >
              <FiArrowLeft /> Go Back
            </Button>
            <div className="relative inline-flex">
              <Button
                onClick={printDividend}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-r-none font-overpass"
              >
                <FiPrinter /> Print Dividend
              </Button>
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

      <div className="pt-24 p-4 mt-30 md:p-8">
        <div className="block mt-10">
          <div ref={allRef}>
            <div ref={dividendRef} className="break-before-page">
              <GenericPrint person={person} documentType="dividend">
                <div className="mb-24 text-sm space-y-4 p-2 print:p-2"></div>
              </GenericPrint>
            </div>
            {/* <div ref={paymentRef} className="break-before-page">
              <GenericPrint person={person} documentType="payment">
                <div className="mb-24 text-sm space-y-4 p-2 print:p-2"></div>
              </GenericPrint>
            </div>
            <div ref={voteRef} className="break-before-page">
              <GenericPrint person={person} documentType="vote">
                <div className="mb-24 text-sm space-y-4 p-2 print:p-2"></div>
              </GenericPrint>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;