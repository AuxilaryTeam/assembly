import React, { useState } from "react";
import logo from "@/assets/Logo.png";
import slogan from "@/assets/logo2.jpg";

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
  person?: Person;
  documentType: "payment" | "dividend" | "vote" | "display";
  header?: React.ReactNode;
  TimeDateDetail?: React.ReactNode;
  children?: React.ReactNode;
}

const GenericPrint: React.FC<GenericPrintProps> = ({
  person,
  documentType,
  header,
  children,
  TimeDateDetail,
}) => {
  // Removed unused state: [isEditingId, setIsEditingId], [idValue, setIdValue]
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState("መስከረም 20 ቀን 2018 ዓ.ም.");

  const handleDateClick = () => {
    setIsEditingDate(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value);
  };

  const handleBlur = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(false);
  };

  // --- Helper Components for clarity and re-usability ---

  const HeaderContent: React.FC = () => (
    <div className="mb-5 text-left pl-8">
      {header ? (
        header
      ) : (
        <h1 className="font-bold bg-red text-lg mb-1 print:text-md">
          እ.ኤ.አ. የ2024/2025 በጀት ዓመት የትርፍ ድርሻን (Dividend) ድልድል ማሳወቂያ
        </h1>
      )}
    </div>
  );

  const TimeDateDetailContent: React.FC = () => (
    <>
      {TimeDateDetail ? (
        <div className="mb-5 text-right pl-8">{TimeDateDetail}</div>
      ) : (
        <div className="mb-4 flex justify-end text-xs pr-6 print:text-2xs">
          <div className="text-right space-y-1">
            <p className="font-overpass text-[14px]">
              <span className="font-semibold ">ID NO:</span>{" "}
              <span className="border-b-2 border-black text-center ml-2">
                {person?.shareholderid &&
                String(person?.shareholderid).length < 4
                  ? String(person?.shareholderid).padStart(4, "0")
                  : person?.shareholderid}
              </span>
            </p>
            <p className="cursor-pointer text-[14px]" onClick={handleDateClick}>
              <span className="font-semibold">የስብሰባ ቀን:</span>{" "}
              <span className="border-b-2 border-black text-center pl-2">
                {isEditingDate ? (
                  <input
                    type="text"
                    value={dateValue}
                    onChange={handleDateChange}
                    onBlur={() => handleBlur(setIsEditingDate)}
                    className="bg-transparent border-none outline-none w-full p-0 m-0 font-abyssinica"
                    autoFocus
                  />
                ) : (
                  <span>{dateValue}</span>
                )}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );

  // --- Conditional Rendering Logic ---

  const renderHeaderFirst = documentType === "display";

  return (
    <div className="bg-white p-14 mb-2 rounded-lg max-w-4xl mx-auto border border-gray-200 print:border-0  print:pr-14 print:pl-14 print:max-w-full font-abyssinica">
      {/* Bank Letterhead (Unchanged) */}
      <div className="flex justify-between items-center mb-3 pb-4 ">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Bank Logo"
            className="h-14 w-auto mr-3 print:h-12"
          />
        </div>
        <img src={slogan} alt="Bank Slogan" className="h-10 w-auto print:h-8" />
      </div>

      {/* Conditional Content Order */}
      {renderHeaderFirst ? (
        <>
          <HeaderContent />
          <TimeDateDetailContent />
        </>
      ) : (
        <>
          <TimeDateDetailContent />
          <HeaderContent />
        </>
      )}

      {/* Shareholder Details (Unchanged) */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="flex items-center gap-5 tracking-wide flex-wrap  w-fit  pl-12">
          <span className="font-semibold whitespace-nowrap">የባለአክሲዮኑ ስም :</span>
          <span className="text-md font-bold border-b-2 pr-4 pl-2 border-black flex-1">
            <span className="font-abyssinica">{person?.nameamh}</span> /{" "}
            <span className="font-overpass">{person?.nameeng}</span>
          </span>
        </div>
      )}

      {/* Financial Details (Only for dividend/payment - Unchanged) */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="max-w-2xl mx-auto mb-4 pl-5 pr-52 pt-6 pb-8">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-base text-center">
            {/* Column headers */}
            <span className="font-semibold mb-4"></span>
            <div className="items-center p-6">
              <span className="border-b-2 text-center border-black w-fit pr-4   pl-2">
                {" "}
                በብር
              </span>
            </div>

            {/* Total Capital */}
            <span className="font-semibold text-left">ሀ. የተፈረመ አክሲዮን:</span>
            <span className="border-b-2 border-black text-center pl-2">
              {Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(person?.totalcapital || 0)}
            </span>

            {/* Paid Capital */}
            <span className="font-semibold text-left">ለ. የተከፈለ አክሲዮን:</span>
            <span className="border-b-2 border-black text-center pl-2">
              {Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(person?.paidcapital || 0)}
            </span>

            {/* Remaining Capital */}
            <span className="font-semibold text-left">ሐ. ያልተከፈለ ቀሪ ገንዘብ:</span>
            <span className="border-b-2 border-black text-center pl-2">
              {Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(
                (person?.totalcapital || 0) - (person?.paidcapital || 0)
              )}
            </span>

            {/* Dividend */}
            <span className="font-semibold text-left">
              መ. የትርፍ ድርሻ (ከታክስ በፊት):
            </span>
            <span className="border-b-2 border-black text-center pl-2">
              {Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(person?.devidend || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Custom Content (Unchanged) */}
      {children}

      {/* Notices (Unchanged) */}
      {(documentType === "dividend" || documentType === "payment") && (
        <div className="mb-4 p-2 rounded mt-2 print:mt-2 print:text-xs">
          <h3 className="font-bold mb-2">
            {" "}
            <span className="border-b-2 text-center border-black w-fit text-lg ">
              ማሳሰቢያ፦
            </span>
          </h3>
          <div className="space-y-1 text-base">
            <p className="flex flex-row">
              <span className="font-normal pr-2">1ኛ/</span>{" "}
              <span>
                የትርፍ ድርሻ ክፍፍሉ ተግባራዊ የሚሆነው የባንኩ ጠቅላላ ጉባዔ ከተከናወነ እና በትርፍ ክፍፍሉ ላይ
                ውሳኔ ከተሰጠ በኋላ እንደሆነ በትህትና እናሳውቃለን፡፡
              </span>
            </p>
            <p className="flex flex-row">
              <span className="font-normal  pr-2"> 2ኛ/</span>{" "}
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

      {/* Footer ID (Unchanged) */}
      {documentType === "dividend" && (
        <div className="flex justify-end mt-8 print:mt-5 font-overpass">
          <div className="flex items-center justify-center border border-black rounded-full px-4 py-2 aspect-square">
            <p className="text-base font-bold whitespace-nowrap">
              {person?.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericPrint;
