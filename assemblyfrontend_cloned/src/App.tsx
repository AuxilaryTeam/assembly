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
import PublicPollDisplay from "./components/pages/Poll";
import PositionsPage from "./components/pages/PositionsPage";
import IssuesPage from "./components/pages/IssuesPage";
import PositionDetailPage from "./components/pages/PositionDetailPage";
import IssueDetailPage from "./components/pages/IssueDetailPage";
import PublicPoposalDisplay from "./components/pages/PublicProposal";
import PollProposalSelectorPage from "./components/pages/PollProposalSelectorPage";

function App() {
  console.log("App component rendering");

  return (
    <>
      <Router basename="/assemblynah">
        <Routes>
          {/* Public Route: Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AuthLayout>
                  <DashboardLayout />
                </AuthLayout>
              }>
              <Route path="/search" element={<Search />} />
              <Route path="/searchprint" element={<Searchprint />} />
              <Route path="/report" element={<Report />} />
              <Route path="/displayprint" element={<Diplayprint />} />
              <Route path="/print" element={<Print />} />
              <Route path="/position" element={<PositionsPage />} />
              <Route path="/positions/:id" element={<PositionDetailPage />} />
              <Route path="/issue" element={<IssuesPage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route
                path="/displayselector"
                element={<PollProposalSelectorPage />}
              />
            </Route>
          </Route>
          <Route path="/proposals/:id" element={<PublicPoposalDisplay />} />
          <Route path="/polls/:id" element={<PublicPollDisplay />} />
          <Route path="/display" element={<Diplay />} />
        </Routes>
      </Router>

      {/* Toast container where toasts will appear */}
      <Toaster />
    </>
  );
}

export default App;
