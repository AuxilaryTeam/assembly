import React, { useRef } from "react";
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

  const allRef = useRef(null);
  const dividendRef = useRef(null);
  const paymentRef = useRef(null);
  const voteRef = useRef(null);

  // ✅ Fixed: Use contentRef instead of content
  const printAll = useReactToPrint({
    contentRef: allRef,
  });

  const printDividend = useReactToPrint({
    contentRef: dividendRef,
  });

  const printPayment = useReactToPrint({
    contentRef: paymentRef,
  });

  const printVote = useReactToPrint({
    contentRef: voteRef,
  });
  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Control Panel - Fixed and Static on Scroll */}
      <div className="print:hidden fixed top-20 left-72 right-10 z-50 bg-white p-4 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-left max-w-4xl mx-auto gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiFileText /> Print Documents for: {person?.nameeng}
          </h1>
          <div className="flex gap-2">
            {/* Back */}
            <Button onClick={goBack} className="flex items-center gap-2">
              <FiArrowLeft /> Go Back
            </Button>
            {/* Print All with dropdown */}
            <div className="relative inline-flex">
              {/* Main Print All Button */}
              <Button
                onClick={printAll}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-r-none"
              >
                <FiPrinter /> Print All
              </Button>
              {/* Dropdown Trigger (Chevron) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center bg-green-600 text-white hover:bg-green-700 rounded-l-none px-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={printDividend}>
                    Print Dividend
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printPayment}>
                    Print Payment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printVote}>
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
                    ቀጥሎ ለተመለከቱት ጉዳዮች ምርጫዎ በሆነው ሳጥን ውስጥ ✓ ምልክት ያድርጉ፡፡
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
                          ለሚያሳድገው አክሲዮን ክፍያ እንዲውል እና ቀሪ ገንዘብ ካለኝ
                          ______________________ ቅርንጫፍ በሚገኘው የሂሣብ ቁጥር
                          ______________________ ገቢ እንዲደረግልኝ ተስማምቻለሁ፡፡
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
                          አዲስ እንዲያድግ የተወሰነውን አክሲዮን ድርሻዬን የማልፈልግ በመሆኑ የትርፍ ድርሻዬን
                          ______________________ ቅርንጫፍ በሚገኘው የሂሣብ ቁጥር
                          ______________________ ገቢ ይደረገልኝ፡፡
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                {/* Extra Info */}
                <div className=" text-sm space-y-2 p-2 gap-2 print:p-">
                  <p>
                    <span className="font-semibold pr-2">የባለአክሲዮኑ ስም :</span>
                    <span className="border-b-2 border-black font-semibold pl-3 tracking-widest inline-block w-64 print:w-48">
                      {person?.nameamh}
                    </span>
                  </p>
                  <div className="flex flex-row gap-6 print:gap-4">
                    <p>
                      <span className="font-semibold text-md">ስልክ ቁጥር:</span>
                      <span className="border-b-2 border-black font-semibold pl-2 tracking-widest inline-block w-32 print:w-32">
                        <span>+251-{person?.phone || "____________"}</span>
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">የግብር ከፋይ መለያ:</span>
                      <span className="pl-2 tracking-widest inline-block w-40 print:w-32">
                        {person?.tin || "_________________"}
                      </span>
                    </p>
                  </div>
                  <p>
                    <span className="font-semibold pr-3">
                      የፋይዳ ልዩ ቁጥር (FAN/FCN ):
                    </span>
                    <span className="pl-2 tracking-widest inline-block w-48 print:w-40">
                      {person?.fan || "___________________"}
                    </span>
                  </p>
                  <div className="flex flex-row gap-6 print:gap-4">
                    <p>
                      <span className="font-semibold">ፊርማ :</span>
                      <span className="pl-2 tracking-widest inline-block w-40 print:w-32">
                        {person?.tin || "_________________"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold pr-3">ቀን:</span>
                      <span className="pl-2 tracking-widest inline-block w-40 print:w-32">
                        {person?.date || "___________________"}
                      </span>
                    </p>
                  </div>
                </div>
              </GenericPrint>{" "}
            </div>
            <div className="break-before-page" />

            {/* Vote */}
            {/* <div ref={voteRef}>
              <GenericPrint
                header={
                  <div className="mb-4 text-center pl-8">
                    <h1 className="font-bold text-lg mb-1  print:text-md">
                      <span className="border-b-2 border-black ">
                        የአቢሲንያ ባንክ አ.ማ የባለአክሲዮኖች 26ኛ መደበኛ ጠቅላላ ጉባዔ የዳይሬክተሮች ቦርድ
                        የምልመላና አስመራጭ ኮሚቴ አባላት ምርጫ የድምጽ መስጫ ካርድ{" "}
                      </span>
                    </h1>
                  </div>
                }
                person={person}
                documentType="vote"
              >
                <div className="mb-2 pt-2 text-left space-y-4  print:p-2">
                  <div className="mb-2 bg-gray-50 rounded print:p-2">
                    <div className="flex items-center gap-5 tracking-wide">
                      <span className="font-semibold">የተፈረሙ አክሲዮኖች ብዛት :</span>

                      <span className="border-b-2 border-black font-semibold pl-3 tracking-widest inline-block w-64 print:w-48">
                        {person?.totalcapital}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-2 text-sm space-y-2 p-2 print:p-2">
                  <p className="font-semibold text-lg">የተመራጭ ስም:</p>
                  <div className="space-y-2 p-10">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-center gap-2">
                        <span className="font-semibold">{num}.</span>
                        <span className="border-b-2  border-black flex-1 h-6"></span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-6">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span>የባለእክሲዮኑ / የተወካዩ ፊርማ ፡</span>
                      <span className="border-b-2 border-black flex-1 h-6"></span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-2 rounded mt-2 print:mt-2 print:text-xs">
                  <h3 className="font-bold mb-4">ማሳሰቢያ፦</h3>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li>ባለአክሲዎኖች ይህንን የድምጽ መስጫ ወረቀት በሚስጥር በመሙላት ድምጽ ይሰጣሉ፡፡</li>
                    <li>
                      ለምልመላና አስመራጭ ኮሚቴ አባልነት ለመምረጥ ከቀረቡት እጩዎች መካከል አምስቱ(5) መመረጥ
                      አለባቸዉ፡፡
                    </li>
                    <li>
                      ባለአክሲዮኖች የመረጧቸዉን አምስቱን(5) ሙሉ ስም ከላይ በተጠቀሰዉ ባዶ ቦታ ላይ በመጻፍ
                      እና በመፈረም፣ የተሞላዉን የድምጽ መስጫ ወረቀት ለሰብሳቢዎች ያስረክ፡፡
                    </li>
                    <li>
                      ይህ የድምጽ መስጫ ወረቀት ከሚከተሉት በአንዱ ምክንያት ዋጋ ያጣል፡፡
                      <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                        <li>የተመራጩ ሙሉ ስም ካልተጻፈበት፣</li>
                        <li>ባለአክሲዮኑ ካልፈረመበት፣</li>
                        <li>የነበረው ጽሁፍ ከጠፋ፣ ከተፋቀ፣ ወይም ስርዝ ድልዝ ካለበት፣</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </GenericPrint>

              <GenericPrint
                header={
                  <div className="mb-4 text-center pl-8">
                    <h1 className="font-bold text-lg mb-1  print:text-md">
                      <span className="border-b-2 border-black ">
                        የአቢሲንያ ባንክ አ.ማ የባለአክሲዮኖች 26ኛ መደበኛ ጠቅላላ ጉባዔ የዳይሬክተሮች ቦርድ
                        የምልመላና አስመራጭ ኮሚቴ አባላት ምርጫ የድምጽ መስጫ ካርድ{" "}
                      </span>
                    </h1>
                  </div>
                }
                person={person}
                documentType="vote"
              >
                  <div className="mb-2 pt-2 text-left space-y-4  print:p-2">
                  <div className="mb-2 bg-gray-50 rounded print:p-2">
                    <div className="flex items-center gap-5 tracking-wide">
                      <span className="font-semibold">የተፈረሙ አክሲዮኖች ብዛት :</span>

                      <span className="border-b-2 border-black font-semibold pl-3 tracking-widest inline-block w-64 print:w-48">
                        {person?.totalcapital}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-2 text-sm space-y-2 p-2 print:p-2">
                  <p className="font-semibold text-lg">የተመራጭ ስም:</p>
                  <div className="grid grid-cols-2 gap-10 p-10">
                    <div className="space-y-2">
                      <p className="font-semibold text-center text-lg">
                        ለመመረጥ የቀረቡ የዕጩዎች ስም ዝርዝር
                      </p>
                      {[...Array(18)].map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span className="border-b-2 border-black flex-1 h-6"></span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 p-8">
                      <p className="font-semibold text-left text-lg">
                        በባለአክስዮኑ የተመረጡ ሙሉ ስም ዝርዝር
                      </p>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="flex items-center gap-2">
                          <span className="font-semibold">{num}.</span>
                          <span className="border-b-2  border-black flex-1 h-6"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-6">
                    <div className="flex items-right gap-2 font-bold text-lg">
                      <span>የባለእክሲዮኑ / የተወካዩ ፊርማ ፡</span>
                      <span className="border-b-2 border-black flex-1 h-6"></span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-2 rounded mt-2 print:mt-2 print:text-xs">
                  <h3 className="font-bold mb-4">ማሳሰቢያ፦</h3>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li> ባለአክሲዮኑ ይህን የድምጽ መስጫ ቅፅ በሚስጥር በመሙላት ድምፅ ይሰጣሉ፡፡ </li>
                    <li>
                      ተፅዕኖ ፈጣሪ ባልሆኑ ባለአክሲዮኖች ብቻ ድምጽ በተሰጠበት ሌላ ቅፅ ማለትም በቅፅ-1 ላይ
                      የተመረጡ ሦስት (3) ዕጩዎችን በዚህ ቅፅ ላይ በድጋሚ አይመርጡም፡፡
                    </li>
                    <li>
                      ለዳይክተሮች ቦርድ አባልነት ለመመረጥ ከላይ ከቀረቡት አስራ ስምንቱ (18) እጩዎች መካከል
                      ስድስቱን (6) ብቻ መምረጥ ይችላሉ፡፡
                    </li>
                    <li>
                      ለዳይክተሮች ቦርድ አባልነት ለመመረጥ ከላይ ከቀረቡት አስራ ስምንቱ (18) እጩዎች መካከል
                      ስድስቱን (6) ብቻ መምረጥ ይችላሉ፡፡
                    </li>
                    <li>
                      የመረጡአቸውን ስድስት (6) ዕጩዎች ሙሉ ስም ከላይ በተቀመጠው ባዶ ቦታ ላይ በመፃፍ እና
                      በመፈረም፤ የተሞላውን የድምፅ መስጫ ቅፅ ያስረክባሉ፡፡
                    </li>
                    <li>
                      ይህ የድምጽ መስጫ ወረቀት ከሚከተሉት በአንዱ ምክንያት ዋጋ ያጣል፡፡
                      <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                        <li>የተመራጩ ሙሉ ስም ካልተጻፈበት፣</li>
                        <li>ባለአክሲዮኑ ካልፈረመበት፣</li>
                        <li>የነበረው ጽሁፍ ከጠፋ፣ ከተፋቀ፣ ወይም ስርዝ ድልዝ ካለበት፣</li>
                        <li>የነበረው ፅሁፍ ከጠፋ፤ ከተፋቀ፡ ወይም ስርዝ ድልዝ ካለበት፤</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </GenericPrint>
            </div>
             */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Print;
