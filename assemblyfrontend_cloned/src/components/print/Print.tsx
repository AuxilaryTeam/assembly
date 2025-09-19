import { useLocation, useNavigate } from "react-router-dom";
import { FiPrinter, FiArrowLeft } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import logo from "../../assets/Logo.png";
import slogan from "../../assets/logo2.jpg";
import React from "react";

const Print = () => {
  const location = useLocation();
  const { person } = location.state || {};
  const navigate = useNavigate();
  const { toast } = useToast();

  const printDocument = () => {
    toast({
      title: "Preparing Document",
      description: "The document is being prepared for printing",
    });

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const goBack = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    const handleAfterPrint = () => {
      navigate("/search");
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Control Panel (Hidden when printing) */}
      <div className="print:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">የትርፍ ድርሻ ማሳወቂያ</h1>
          <div className="flex gap-2">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              <FiArrowLeft /> Go Back
            </button>
            <button
              onClick={printDocument}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <FiPrinter /> Print Dividend
            </button>
            <button
              onClick={() => window.alert("Vote Paper ")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <FiPrinter /> Print Vote Paper
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ይኽ የሚታተም ሰነድ ለባለአክሲዮኑ {person?.nameamh} የተዘጋጀ ነው
        </p>
      </div>

      {/* Printable Document */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200 print:border-0 print:shadow-none print:p-0">
        {/* Bank Letterhead */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4 print:pb-2">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Bank Logo"
              className="h-14 w-auto mr-3 print:h-12"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 print:text-lg">
                አቢሲኒያ ባንክ
              </h1>
              <p className="text-md text-gray-700 print:text-sm">
                የባለአክሲዮኖች ጉባኤ
              </p>
            </div>
          </div>
          <img
            src={slogan}
            alt="Bank Slogan"
            className="h-10 w-auto print:h-8"
          />
        </div>

        {/* Document Header */}
        <div className="mb-4 text-center">
          <h1 className="font-bold text-lg mb-1 print:text-md">
            እ.ኤ.አ. የ2023/2024 በጀት ዓመት የትርፍ ድርሻን (Dividend) ድልድል ማሳወቂያ
          </h1>
          <p className="text-xs text-gray-600 print:text-2xs">
            የሰነድ መለያ: BOA-DIV-{person?.id}-{new Date().getFullYear()}
          </p>
        </div>

        {/* Shareholder Information */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs print:text-2xs">
          <div>
            <p>
              <span className="font-semibold">የባለአክሲዮኑ መለያ:</span>{" "}
              {person?.shareholderid}
            </p>
            <p>
              <span className="font-semibold">የሰነድ ቀን:</span> ኅዳር 5 ቀን 2017 ዓ.ም.
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">የተጻፈበት ቀን:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">የሰነድ ሁኔታ:</span> ንቁ
            </p>
          </div>
        </div>

        {/* Shareholder Details */}
        <div className="mb-4 p-3 bg-gray-50 rounded print:p-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">የባለአክሲዮኑ ስም:</span>
            <span className="text-md font-bold">
              {person?.nameamh} / {person?.nameeng}
            </span>
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-6">
          <h2 className="text-md font-bold mb-3 text-center border-b pb-1 print:text-sm">
            የፋይናንስ ዝርዝሮች
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="font-semibold">የተፈረመ አክሲዮን:</span>
              <span className="font-bold text-blue-900">
                {Intl.NumberFormat("en-US").format(person?.totalcapital || 0)}{" "}
                ብር
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b">
              <span className="font-semibold">የተከፈለ አክሲዮን:</span>
              <span className="font-bold text-blue-900">
                {Intl.NumberFormat("en-US").format(person?.paidcapital || 0)} ብር
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b">
              <span className="font-semibold">ያልተከፈለ ቀሪ ገንዘብ:</span>
              <span className="font-bold text-blue-900">
                {Intl.NumberFormat("en-US").format(
                  (person?.totalcapital || 0) - (person?.paidcapital || 0)
                )}{" "}
                ብር
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b">
              <span className="font-semibold">የትርፍ ድርሻ (ከታክስ በፊት):</span>
              <span className="font-bold text-blue-900">
                {Intl.NumberFormat("en-US").format(person?.devidend || 0)} ብር
              </span>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="mb-6 p-3 bg-blue-50 rounded print:p-2">
          <h3 className="font-bold text-blue-900 mb-2 print:text-xs">ማሳሰቢያ፦</h3>
          <div className="space-y-2 text-xs print:text-2xs">
            <p>
              <span className="font-semibold">1.</span> የትርፍ ድርሻ ክፍፍሉ ተግባራዊ
              የሚሆነው የባንኩ ጠቅላላ ጉባዔ ከተከናወነ እና በትርፍ ክፍፍሉ ላይ ውሳኔ ከተሰጠ በኋላ እንደሆነ
              በትህትና እናሳውቃለን፡፡
            </p>
            <p>
              <span className="font-semibold">2.</span> በ14ኛው የባለአክሲዮኖች አስቸኳይ
              ጠቅላላ ጉባዔ ውሳኔ መሠረት ባለአክሲዮኑ አዲስ አክሲዮን ለመግዛት የፈረሟቸውና ዋጋቸው በሙሉ ካልተከፈለ፤
              ለባለአክስዮኑ የሚደርሰው ትርፍ ድርሻ ዋጋቸው ላልተከፈሉ ቀሪ የተፈረሙ አክሲዮኖች ክፍያ የሚውል
              ይሆናል፡፡
            </p>
            <p>
              <span className="font-semibold">3.</span> የባንክ ሥራ አዋጅን ለማሻሻል በወጣው
              አዋጅ ቁጥር 1159/2019 መሠረት ማንኛውም ባለአክሲዮን የትርፍ ድርሻው የሚከፈለው ወይም ላለበት
              ላለበት ላልተከፈለ ቀሪ የአክሲዮን ክፍያ እንዲውል የሚደረገው ባለአክሲዮኑ ኢትዮጵያዊ ዜግነት ወይም
              ትውልደ ኢትዮጵያዊ መሆናቸውን የሚገልጽ የታደሰ መታወቂያ፣ ድርጅቶች ከሆኑ የድርጅቱ ባለአክሲዮኖች በሙሉ
              ኢትዮጵያዊ ዜግነት ወይም ትውልደ ኢትዮጵያውያን መሆናቸውን የሚያረጋግጥ የመመሥረቻ ጽሑፍ ወይም ሌላ
              ተቀባይነት ያለው ማስረጃ ዋናውን ከኮፒ ጋር በመያዝ በባንኩ ዋናው መ/ቤት አክስዮን እና ኢንቨስትመንት
              ክፍል በአካል በመቅረብ የተዘጋጀውን ፎርም ሞልቶ ሲፈርም መሆኑን በትህትና እናሳውቃለን፡፡
            </p>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 print:mt-4">
          <div className="text-center">
            <div
              className="border-t border-gray-400 pt-3 mx-auto"
              style={{ width: "80%" }}>
              <p className="font-semibold text-sm">የባንኩ የአክሲዮን አስተዳዳሪ</p>
              <p className="text-xs text-gray-600">ስም እና ፊርማ</p>
            </div>
          </div>
          <div className="text-center">
            <div
              className="border-t border-gray-400 pt-3 mx-auto"
              style={{ width: "80%" }}>
              <p className="font-semibold text-sm">የባለአክሲዮኑ ፊርማ</p>
              <p className="text-xs text-gray-600">ስም እና ፊርማ</p>
            </div>
          </div>
        </div>

        {/* Document ID */}
        <div className="flex justify-end mt-4 print:mt-3">
          <div className="flex items-center justify-center w-8 h-8 border border-black rounded-full print:w-6 print:h-6">
            <p className="text-xs font-bold print:text-2xs">{person?.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t pt-3 print:mt-4 print:text-2xs">
          <p>ይህ የአቢሲኒያ ባንክ ኦፊሴላዊ የትርፍ ድርሻ ማሳወቂያ ሰነድ ነው</p>
          <p>ሰነድ የተፈጠረው ቀን {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Print;
