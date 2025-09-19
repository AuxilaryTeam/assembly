import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Search from "./components/search/Search";
import Searchprint from "./components/search/Searchprint";
import Diplay from "./components/display/Diplay";
import Diplayprint from "./components/display/Diplayprint";
import Print from "./components/print/Print";
import Report from "./components/report/Report";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";

function App() {
  console.log("App component rendering");
  
  return (
    <>
      <Router>
        <Routes>
          {/* Public Route: Login */}
          <Route path="/assemblynah/" element={<Login />} />
          <Route path="/assemblynah/login" element={<Login />} />

          {/* Protected Routes */}
         <Route element={<ProtectedRoute />}>
  <Route element={
    <AuthLayout>
      <DashboardLayout />
    </AuthLayout>
  }>
    <Route path="/assemblynah/search" element={<Search />} />
    <Route path="/assemblynah/searchprint" element={<Searchprint />} />
    <Route path="/assemblynah/report" element={<Report />} />
    <Route path="/assemblynah/displayprint" element={<Diplayprint />} />
    <Route path="/assemblynah/print" element={<Print />} />
  </Route>
</Route>
    <Route path="/assemblynah/display" element={<Diplay />} />
        </Routes>
      </Router>

      {/* Toast container where toasts will appear */}
      <Toaster />
    </>
  );
}

export default App;