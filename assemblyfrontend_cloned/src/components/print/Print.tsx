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
                onClick={printAll}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-r-none font-overpass"
              >
                <FiPrinter /> Print All
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
                    onClick={printDividend}
                    className="font-overpass"
                  >
                    Print Dividend
                  </DropdownMenuItem>
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
            <div className="break-before-page" />

            {/* Payment */}
            <div ref={paymentRef}>
              <GenericPrint person={person} documentType="payment">
                {/* Payment-specific content */}
                <div className="mb-2 text-sm space-y-4 p-2 print:p-2">
                  <p className="font-extrabold text-lg print:text-base">
                    ቀጥሎ ለተመለከቱት ጉዳዮች ምርጫዎ በሆነው ሳጥን ውስጥ
                    <span className="inline-flex border-2 border-black w-6 h-6 items-center justify-center mx-1">
                      <span className="font-bold">✓</span>
                    </span>
                    ምልክት ያድርጉ፡፡
                  </p>
                  <div className="pl-8 space-y-2 tracking-wide inline-block text-base print:text-sm">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-5 border-black border-2 print:size-4"
                      />
                      <span>
                        1.{" "}
                        <span className="pl-1">
                          ከላይ የተገለፀው 2024/2025 በጀት ዓመት የትርፍ ድርሻ አክሲዮን ማህበሩ አዲስ
                          ለሚያሳድገው አክሲዮን ክፍያ እንዲውል እና ቀሪ ገንዘብ ካለኝ{" "}
                          <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                          ቅርንጫፍ በሚገኘው የሂሣብ ቁጥር{" "}
                          <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                          ገቢ እንዲደረግልኝ ተስማምቻለሁ፡፡{" "}
                        </span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-5 border-black border-2 print:size-4"
                      />
                      <span>
                        2.{" "}
                        <span className="pl-1">
                          አዲስ እንዲያድግ የተወሰነውን አክሲዮን ድርሻዬን የማልፈልግ በመሆኑ የትርፍ ድርሻዬን{" "}
                          <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                          ቅርንጫፍ በሚገኘው የሂሣብ ቁጥር{" "}
                          <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                          ገቢ ይደረገልኝ፡፡{" "}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                {/* Extra Info */}
                <div className="text-sm space-y-2 p-2 pt-4 pl-14 gap-2 print:pl-14">
                  <p>
                    <span className="font-semibold pr-2">
                      የባለአክሲዮኑ(የተወካዩ) ስም :
                    </span>
                    <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                  </p>
                  <div className="flex flex-row gap-6 print:gap-4">
                    <p>
                      <span className="font-semibold text-md font-overpass">
                        ስልክ ቁጥር :{" "}
                      </span>
                      <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                    </p>
                    <p>
                      <span className="font-semibold">የግብር ከፋይ መለያ ቁጥር :</span>
                      <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                    </p>
                  </div>
                  <p>
                    <span className="font-semibold pr-3">
                      የፋይዳ ልዩ ቁጥር (FAN/FCN ):
                    </span>
                    <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                  </p>
                  <div className="flex flex-row gap-6 print:gap-4">
                    <p>
                      <span className="font-semibold">ፊርማ :</span>
                      <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                    </p>
                    <p>
                      <span className="font-semibold pr-3">ቀን:</span>
                      <span className="border-b border-black pl-3 tracking-widest inline-block w-48 print:w-48"></span>{" "}
                    </p>
                  </div>
                </div>
              </GenericPrint>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
