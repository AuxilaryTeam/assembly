import React from "react";
import logo from "../../assets/Logo.png";
import slogan from "../../assets/logo2.jpg";

interface Person {
  id?: string;
  shareholderid?: string;
  nameamh?: string;
  nameeng?: string;
  totalcapital?: number;
  paidcapital?: number;
  devidend?: number;
  phone?: string;
  tin?: string;
  fan?: string;
  date?: string;
}

interface GenericPrintProps {
  person: Person;
  documentType: "payment" | "dividend" | "vote";
  header?: React.ReactNode; // New prop for custom header
  children?: React.ReactNode;
}

const GenericPrint: React.FC<GenericPrintProps> = ({
  person,
  documentType,
  header,
  children,
}) => {
  return (
    <div className="bg-white p-14 mb-2 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200 print:border-0 print:shadow-none print:pr-14 print:pl-14 print:max-w-full">
      {/* Bank Letterhead */}
      <div className="flex justify-between items-center mb-6 pb-4 print:pb-2 pr-6 pl-14">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Bank Logo"
            className="h-14 w-auto mr-3 print:h-12"
          />
        </div>
        <img src={slogan} alt="Bank Slogan" className="h-10 w-auto print:h-8" />
      </div>

      {/* Document Header */}
      {header ? (
        <div className="mb-4 text-left pl-8">{header}</div>
      ) : (
        <div className="mb-4 text-left pl-8">
          <h1 className="font-bold text-lg mb-1 print:text-md">
            እ.ኤ.አ. የ2024/2025 በጀት ዓመት የትርፍ ድርሻን (Dividend) ድልድል ማሳወቂያ
          </h1>
        </div>
      )}

      {/* Shareholder Information */}
      <div className="mb-4 flex justify-end text-xs pr-6 print:text-2xs print:pr-4">
        <div className="text-right space-y-1">
          <p>
            <span className="font-semibold">ID NO:</span>{" "}
            {person?.shareholderid}
          </p>
          <p>
            <span className="font-semibold">የሰነድ ቀን:</span> መስከረም 20 ቀን 2018
            ዓ.ም.
          </p>
        </div>
      </div>

      {/* Shareholder Details */}
      <div className="  bg-gray-50 rounded print:p-2">
        <div className="flex items-center gap-5 tracking-wide">
          <span className="font-semibold">የባለአክሲዮኑ ስም :</span>
          <span className="text-md font-bold border-b-2 border-black ">
            {person?.nameamh} / {person?.nameeng}
          </span>
        </div>
      </div>

      {/* Financial Details (Only for dividend/payment) */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="max-w-3xl mx-auto mb-2 p-10">
          <div className="grid grid-cols-2 gap-2 text-base">
            <span className="font-semibold">ሀ. የተፈረመ አክሲዮን:</span>
            <span className="border-b-2 border-black text-center">
              {Intl.NumberFormat("en-US").format(person?.totalcapital || 0)} ብር
            </span>

            <span className="font-semibold">ለ. የተከፈለ አክሲዮን:</span>
            <span className="border-b-2 border-black text-center">
              {Intl.NumberFormat("en-US").format(person?.paidcapital || 0)} ብር
            </span>

            <span className="font-semibold">ሐ. ያልተከፈለ ቀሪ ገንዘብ:</span>
            <span className="border-b-2 border-black text-center">
              {Intl.NumberFormat("en-US").format(
                (person?.totalcapital || 0) - (person?.paidcapital || 0)
              )}{" "}
              ብር
            </span>

            <span className="font-semibold">መ. የትርፍ ድርሻ (ከታክስ በፊት):</span>
            <span className="border-b-2 border-black text-center">
              {Intl.NumberFormat("en-US").format(person?.devidend || 0)} ብር
            </span>
          </div>
        </div>
      )}

      {/* Custom Content */}
      {children}

      {/* Notices */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="mb-4 p-2 rounded mt-2 print:mt-2 print:text-xs">
          <h3 className="font-bold  mb-6">ማሳሰቢያ፦</h3>
          <div className="space-y-1 text-xs">
            <p className="flex flex-row">
              <span className="font-semibold pr-2">1ኛ/</span>{" "}
              <span>
                የትርፍ ድርሻ ክፍፍሉ ተግባራዊ የሚሆነው የባንኩ ጠቅላላ ጉባዔ ከተከናወነ እና በትርፍ ክፍፍሉ ላይ
                ውሳኔ ከተሰጠ በኋላ እንደሆነ በትህትና እናሳውቃለን፡፡
              </span>
            </p>
            <p className="flex flex-row">
              <span className="font-semibold pr-2"> 2ኛ/</span>{" "}
              <span>
                የባንክ ሥራ አዋጅን ለማሻሻል በወጣው አዋጅ ቁጥር 1159/2019 መሠረት ማንኛውም ባለአክሲዮን
                የትርፍ ድርሻው የሚከፈለው ወይም የትርፍ ድርሻውን ለካፒታል ማሳደጊያ እንዲውል የሚደረገው ባለአክሲዮኑ
                ኢትዮጵያዊ ዜግነት ወይም ትውልደ ኢትዮጵያዊ መሆናቸውን የሚገልጽ የኢትዮጵያ ዲጂታል መታወቂያ ካርድ፣
                የታደሰ መታወቂያ (የቀበሌ መታወቂያ፤ መንጃ ፈቃድ፤ ፓስፓርት ወይም ሌላ መረጃ)፣ ድርጅት ከሆነ
                የድርጅቱ ባለአክሲዮኖች በሙሉ ኢትዮጵያዊ ዜግነት ወይም ትውልደ ኢትዮጵያውያን መሆናቸውን የሚያረጋግጥ
                የመመሥረቻ ጽሑፍ ወይም ሌላ ተቀባይነት ያለው ማስረጃ ዋናውን ከኮፒ ጋር በመያዝ በባንኩ ዋናው መ/ቤት
                አክስዮን እና ኢንቨስትመንት ክፍል በአካል በመቅረብ የተዘጋጀውን ፎርም ሞልቶ ሲፈርም መሆኑን በትህትና
                እናሳውቃለን፡፡
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Document ID */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="flex justify-end mt-8 print:mt-5">
          <div className="flex items-center justify-center w-8 h-8 border border-black rounded-full print:w-6 print:h-6">
            <p className="text-xs font-bold print:text-2xs">{person?.id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericPrint;
