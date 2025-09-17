import React, { type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{
        backgroundImage: "url('/CRM background.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // or "contain" depending on your needs
        backgroundPosition: "center",
        backgroundColor: "#f5f4f2", // fallback color
      }}>
      <Header />
      <main className="flex-grow">
        <ToastContainer />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
